import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from "./config/db.js";
import authRoutes from "./routes/auth_routes.js";
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API de comentarios funcionando");
});


app.get("/api/test-db", async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    res.send("Conexión a MySQL funcionando correctamente");
  } catch (error) {
    res.status(500).send("Error al conectar a MySQL: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
