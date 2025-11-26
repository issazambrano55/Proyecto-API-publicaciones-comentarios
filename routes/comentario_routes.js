import { Router } from "express";
import {
  obtenerTodosLosComentarios,
  obtenerComentariosPorPublicacion,
  publicarComentario,
  actualizarComentarioController,
  eliminarComentarioController,
} from "../controllers/comentario_controllers.js";

import { verifyToken } from "../middlewares/verify_token.js";
import { validarComentarios } from "../middlewares/validarComentarios.js";

const router = Router();

/**
 * @swagger
 * /api/comentarios:
 *   get:
 *     summary: Listar todos los comentarios
 *     tags:
 *       - Comentarios
 *     responses:
 *       200:
 *         description: Lista de comentarios
 */
router.get("/comentarios", obtenerTodosLosComentarios);

/**
 * @swagger
 * /api/publicaciones/{id}/comentarios:
 *   get:
 *     summary: Listar comentarios de una publicación
 *     tags:
 *       - Comentarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentarios de la publicación
 *       404:
 *         description: Publicación no existe
 */
router.get("/publicaciones/:id/comentarios", obtenerComentariosPorPublicacion);

/**
 * @swagger
 * /api/publicaciones/{id}/comentarios:
 *   post:
 *     summary: Crear comentario en una publicación
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post(
  "/publicaciones/:id/comentarios",
  verifyToken,
  validarComentarios,
  publicarComentario
);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   put:
 *     summary: Actualizar un comentario
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado
 */
router.put(
  "/comentarios/:id",
  verifyToken,
  validarComentarios,
  actualizarComentarioController
);

/**
 * @swagger
 * /api/comentarios/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags:
 *       - Comentarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentario eliminado
 */
router.delete("/comentarios/:id", verifyToken, eliminarComentarioController);

export default router;
