import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
//Connect to the database
const mySqlPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  connectTimeout: 60000,
});

export default mySqlPool;
