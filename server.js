import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from "./config/db.js";
import authRoutes from "./routes/auth_routes.js";
import comentarioRoutes from "./routes/comentario_routes.js";
import publicacion_routes from "./routes/publicacion_routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de comentarios funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api", comentarioRoutes);


app.use(errorHandler);  

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
