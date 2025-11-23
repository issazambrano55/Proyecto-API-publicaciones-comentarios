import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conectado a MySQL correctamente");
    connection.release();
  } catch (error) {
    console.error("Error conectando a MySQL:", error);
  }
})();

export default db;
