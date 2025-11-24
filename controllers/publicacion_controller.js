import sanitizeHtml from "sanitize-html";
import { z } from "zod";

import {
  getAllPublicaciones,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion
} from "../models/publicacionModel.js";

import {
  ok,
  created,
  badRequest,
  notFound,
  forbidden,
  unprocessable,
  sendResponse
} from "../utils/utils.js";

import db from "../config/db.js";

// Schema de validacion para crear/actualizar publicacion
const publicacionSchema = z.object({
  title: z
    .string({
      required_error: "El titulo es obligatorio"
    })
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(255, "El titulo no puede tener mas de 255 caracteres"),

  content: z
    .string({
      required_error: "El contenido es obligatorio"
    })
    .min(1, "El contenido no puede estar vacio"),

  image: z
    .string()
    .url("La imagen debe ser una URL valida")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  category_id: z
    .preprocess(
      (val) => {
        if (val === null || val === undefined || val === "") return undefined;
        const num = Number(val);
        return Number.isNaN(num) ? undefined : num;
      },
      z
        .number({
          invalid_type_error: "La categoria debe ser un numero"
        })
        .int("La categoria debe ser un numero entero")
        .positive("La categoria debe ser un id valido")
        .optional()
    )
});

// Verificar si la categoria existe (si se envia)
const verificarCategoriaExiste = async (categoryId) => {
  const [rows] = await db.query(
    "SELECT id FROM categories WHERE id = ?",
    [categoryId]
  );
  return rows.length > 0;
};

// Listar todas las publicaciones
export const listarPublicaciones = async (req, res, next) => {
  try {
    const publicaciones = await getAllPublicaciones();
    const resp = ok("Publicaciones obtenidas correctamente", publicaciones);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};

// Ver una publicacion especifica
export const obtenerPublicacionPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNumerico = Number(id);

    if (Number.isNaN(idNumerico)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const publicacion = await getPublicacionById(idNumerico);

    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicacion no existe")
      );
    }

    const resp = ok("Publicación obtenida correctamente", publicacion);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};

// Crear nueva publicación (auth)
export const crearPublicacionController = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(
        res,
        badRequest("No se pudo identificar al usuario autenticado")
      );
    }

    const resultado = publicacionSchema.safeParse(req.body);

    if (!resultado.success) {
      const errores = resultado.error.errors.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        unprocessable("Error de validacion en la publicacion", errores)
      );
    }

    let { title, content, image, category_id } = resultado.data;

    // Sanitizar para evitar XSS
    title = sanitizeHtml(title, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    content = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    if (!title || !content) {
      return sendResponse(
        res,
        badRequest("El titulo y el contenido no pueden quedar vacios despues de limpiar el contenido")
      );
    }

    // Verificar categoria si se envia
    if (category_id !== undefined) {
      const categoriaExiste = await verificarCategoriaExiste(category_id);
      if (!categoriaExiste) {
        return sendResponse(
          res,
          badRequest("La categoria indicada no existe")
        );
      }
    }

    const newPostId = await createPublicacion({
      title,
      content,
      image: image || null,
      user_id: userId,
      category_id
    });

    const resp = created("Publicacion creada exitosamente", {
      id: newPostId,
      title,
      content,
      image: image || null,
      user_id: userId,
      category_id: category_id ?? null
    });

    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};

// Editar publicación (solo autor)
export const actualizarPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNumerico = Number(id);

    if (Number.isNaN(idNumerico)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(
        res,
        badRequest("No se pudo identificar al usuario autenticado")
      );
    }

    // Ver si la publicación existe
    const publicacion = await getPublicacionById(idNumerico);
    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicacion no existe")
      );
    }

    // Verificar que el usuario sea el autor
    if (publicacion.user_id !== userId) {
      return sendResponse(
        res,
        forbidden("Solo el autor puede editar esta publicacion")
      );
    }

    const resultado = publicacionSchema.safeParse(req.body);

    if (!resultado.success) {
      const errores = resultado.error.errors.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        unprocessable("Error de validacion en la publicacion", errores)
      );
    }

    let { title, content, image, category_id } = resultado.data;

    // Sanitizar
    title = sanitizeHtml(title, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    content = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();

    if (!title || !content) {
      return sendResponse(
        res,
        badRequest("El titulo y el contenido no pueden quedar vacíos después de limpiar el contenido")
      );
    }

    // Verificar categoria si se envía
    if (category_id !== undefined) {
      const categoriaExiste = await verificarCategoriaExiste(category_id);
      if (!categoriaExiste) {
        return sendResponse(
          res,
          badRequest("La categoria indicada no existe")
        );
      }
    }

    const actualizada = await updatePublicacion(idNumerico, {
      title,
      content,
      image: image || null,
      category_id
    });

    if (!actualizada) {
      return sendResponse(
        res,
        badRequest("No se pudo actualizar la publicacion")
      );
    }

    const resp = ok("Publicacion actualizada exitosamente", {
      id: idNumerico,
      title,
      content,
      image: image || null,
      category_id: category_id ?? null
    });

    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};
// Eliminar publicación (solo autor)
export const eliminarPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNumerico = Number(id);

    if (Number.isNaN(idNumerico)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(
        res,
        badRequest("No se pudo identificar al usuario autenticado")
      );
    }

    const publicacion = await getPublicacionById(idNumerico);
    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicación no existe")
      );
    }

    if (publicacion.user_id !== userId) {
      return sendResponse(
        res,
        forbidden("Solo el autor puede eliminar esta publicacion")
      );
    }

    const eliminada = await deletePublicacion(idNumerico);

    if (!eliminada) {
      return sendResponse(
        res,
        badRequest("No se pudo eliminar la publicacion")
      );
    }

    const resp = ok("Publicacion eliminada exitosamente", null);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};