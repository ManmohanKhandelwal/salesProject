import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
//Connect to the database
const mySqlPool = mysql.createPool({
  host: process.env.DB_AWS_RDS_ENDPOINT,
  user: process.env.DB_RDS_USERNAME,
  password: process.env.DB_RDS_PASSWORD,
  port: process.env.DB_RDS_PORT,
  database: process.env.DB_RDS_DATABASE,
});

export default mySqlPool;
