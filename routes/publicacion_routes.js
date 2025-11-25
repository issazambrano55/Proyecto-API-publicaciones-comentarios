import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";

import {
  listarPublicaciones,
  obtenerPublicacionPorId,
  crearPublicacionController,
  actualizarPublicacion,
  eliminarPublicacion
} from "../controllers/publicacion_controller.js";

const router = Router();

router.get("/", listarPublicaciones);
router.get("/:id", obtenerPublicacionPorId);
router.post("/", verifyToken, crearPublicacionController);
router.put("/:id", verifyToken, actualizarPublicacion);
router.delete("/:id", verifyToken, eliminarPublicacion);

export default router;