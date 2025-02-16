from fastapi import FastAPI # type: ignore 
import pandas as pd # type: ignore
import numpy as np  # type: ignore
from sqlalchemy import create_engine # type: ignore
from urllib.parse import quote
import pymysql # type: ignore
from prophet import Prophet # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore

# Initialize FastAPI
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# MySQL connection details
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Nilanjan@12345",
    "database": "sales_db"
}

encoded_password = quote(db_config["password"])
engine = create_engine(f"mysql+pymysql://{db_config['user']}:{encoded_password}@{db_config['host']}/{db_config['database']}", pool_pre_ping=True)

# ✅ Define Indian Holidays
holidays = pd.DataFrame({
    'holiday': [
        'diwali', 'dussehra', 'navratri', 'christmas', 'new_year', 'republic_day',
        'pongal', 'holi', 'makar_sankranti'
    ],
    'ds': pd.to_datetime([
        '2024-10-31', '2024-10-12', '2024-10-03', '2024-12-25', '2025-01-01', '2025-01-26',
        '2025-01-15', '2025-03-14', '2025-01-14'
    ]),
    'lower_window': 0,
    'upper_window': 2  
})

@app.get("/forecast")
def get_forecast():
    try:
        # Fetch sales data
        query = """
        SELECT DATE_FORMAT(document_date, '%Y-%m-01') AS month_start, 
               SUM(retailing) AS total_sales 
        FROM psr_data 
        GROUP BY month_start 
        ORDER BY month_start;
        """

        connection = engine.raw_connection()
        df = pd.read_sql(query, con=connection)
        connection.close()

        # Convert to datetime and rename for Prophet
        df["month_start"] = pd.to_datetime(df["month_start"])
        df = df.rename(columns={"month_start": "ds", "total_sales": "y"})

        # ✅ Convert values to Crores if needed
        if df["y"].max() > 1e7:  
            df["y"] /= 1e7  

        # ✅ Remove zero or negative values to avoid log issues
        df = df[df["y"] > 0]

        # ✅ Apply log transformation **only for valid values**
        df["y"] = np.log1p(df["y"])

        # ✅ Initialize Prophet Model
        model = Prophet(holidays=holidays, seasonality_mode="multiplicative")
        model.fit(df)

        # ✅ Create Future Dates (Next 6 months)
        future_dates = pd.date_range(start="2024-10-01", end="2025-03-31", freq='M')
        future = pd.DataFrame({"ds": future_dates})

        # ✅ Predict Sales
        forecast = model.predict(future)

        # ✅ Convert back from log scale safely
        forecast[["yhat", "yhat_lower", "yhat_upper"]] = np.expm1(forecast[["yhat", "yhat_lower", "yhat_upper"]])

        # ✅ Clip values at 0 to avoid negative sales
        forecast[["yhat", "yhat_lower", "yhat_upper"]] = forecast[["yhat", "yhat_lower", "yhat_upper"]].clip(lower=0)  

        # ✅ Format results
        forecast["ds"] = forecast["ds"].dt.strftime("%b %Y")
        forecast_table = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
        forecast_table.columns = ["Month", "Projected Sales (₹ Cr)", "Lower Estimate (₹ Cr)", "Upper Estimate (₹ Cr)"]

        return forecast_table.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}
