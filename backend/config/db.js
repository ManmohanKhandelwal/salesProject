import mysql from "mysql2/promise";

const mySqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nilanjan@12345",
  port: 3306,
  database: "sales_db",
});

export default mySqlPool;
