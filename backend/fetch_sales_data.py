from fastapi import FastAPI  # type: ignore
import pandas as pd  # type: ignore
import numpy as np  # type: ignore
from sqlalchemy import create_engine  # type: ignore
from urllib.parse import quote
from prophet import Prophet  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from functools import lru_cache  # Cache results for faster response

# Initialize FastAPI
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL connection details
db_config = {}
with open("db_config_file.py", "r") as file:
    exec(file.read())  # This will load the db_config dictionary from the file

print(db_config)

encoded_password = quote(db_config["password"])
engine = create_engine(
    f"mysql+pymysql://{db_config['user']}:{encoded_password}@{db_config['host']}/{db_config['database']}",
    pool_pre_ping=True,
)

# ✅ Cache Forecast Data to Speed Up Subsequent Requests
@lru_cache(maxsize=1)
def fetch_forecast():
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

        # ✅ Initialize Prophet Model (Removed Holidays)
        model = Prophet(seasonality_mode="multiplicative")
        model.fit(df)

        # ✅ Create Future Dates (Forecast for July, Aug, Sep 2025)
        future_dates = pd.date_range(start="2025-07-01", end="2025-09-30", freq="M")
        future = pd.DataFrame({"ds": future_dates})

        # ✅ Predict Sales
        forecast = model.predict(future)

        # ✅ Convert back from log scale safely
        forecast[["yhat", "yhat_lower", "yhat_upper"]] = np.expm1(
            forecast[["yhat", "yhat_lower", "yhat_upper"]]
        )

        # ✅ Clip values at 0 to avoid negative sales
        forecast[["yhat", "yhat_lower", "yhat_upper"]] = forecast[
            ["yhat", "yhat_lower", "yhat_upper"]
        ].clip(lower=0)

        # ✅ Format results
        forecast["ds"] = forecast["ds"].dt.strftime("%b %Y")
        forecast_table = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]]
        forecast_table.columns = [
            "Month",
            "Projected Sales (₹ Cr)",
            "Lower Estimate (₹ Cr)",
            "Upper Estimate (₹ Cr)",
        ]

        return forecast_table.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}


@app.get("/forecast")
def get_forecast():
    return fetch_forecast()
