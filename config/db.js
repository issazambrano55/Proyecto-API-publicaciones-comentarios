import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.getConnection()
  .then((conn) => {
    console.log(" Conexión a MySQL exitosa");
    conn.release();
  })
  .catch((err) => {
    console.error(" Error conectando a MySQL:", err.message);
  });

export default db;

