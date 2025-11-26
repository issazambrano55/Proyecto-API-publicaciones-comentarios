import { Router } from "express";
import { verifyToken } from "../middlewares/verify_token.js";

import {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacionController,
  actualizarPublicacionController,
  eliminarPublicacionController,
  listarCategorias,
} from "../controllers/publicacion_controller.js";

const router = Router();

/**
 * @swagger
 * /api/publicaciones:
 *   get:
 *     summary: Listar todas las publicaciones
 *     tags:
 *       - Publicaciones
 *     responses:
 *       200:
 *         description: Lista de publicaciones
 */
router.get("/", listarPublicaciones);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   get:
 *     summary: Obtener una publicación por ID
 *     tags:
 *       - Publicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *       404:
 *         description: Publicación no existe
 */
router.get("/:id", obtenerPublicacion);

/**
 * @swagger
 * /api/publicaciones:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags:
 *       - Publicaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, category_title]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               category_title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publicación creada
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post("/", verifyToken, crearPublicacionController);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   put:
 *     summary: Actualizar una publicación
 *     tags:
 *       - Publicaciones
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
 *         description: Publicación actualizada
 *       403:
 *         description: No tienes permiso
 */
router.put("/:id", verifyToken, actualizarPublicacionController);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   delete:
 *     summary: Eliminar una publicación
 *     tags:
 *       - Publicaciones
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
 *         description: Publicación eliminada
 */
router.delete("/:id", verifyToken, eliminarPublicacionController);

/**
 * @swagger
 * /api/publicaciones/categorias/listar:
 *   get:
 *     summary: Listar categorías disponibles
 *     tags:
 *       - Publicaciones
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/categorias/listar", listarCategorias);

export default router;
