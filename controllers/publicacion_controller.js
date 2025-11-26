import {obtenerPublicaciones, obtenerPublicacionPorId, crearPublicacion, actualizarPublicacion,
eliminarPublicacionYComentarios, obtenerPublicacionConAutor, obtenerCategorias
} from "../models/publicacion_model.js";

import {ok, created, badRequest, notFound, forbidden, unprocessable, sendResponse
} from "../utils/utils.js";

import { publicacionSchema } from "../schemas/validators_publicacion.js";

export const listarPublicaciones = async (req, res, next) => {
  try {
    const publicaciones = await obtenerPublicaciones();
    const resp = ok("Publicaciones obtenidas correctamente", publicaciones);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};

export const obtenerPublicacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const publicacion = await obtenerPublicacionPorId(id);
    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicación no existe")
      );
    }

    const resp = ok("Publicacion obtenida correctamente", publicacion);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const crearPublicacionController = async (req, res, next) => {
  try {
    const parseResult = publicacionSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errores = parseResult.error.issues.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        unprocessable("Error de validacion en la publicacion", errores)
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(
        res,
        badRequest("No se pudo identificar al usuario autenticado")
      );
    }

    const data = parseResult.data;

    const newPostId = await crearPublicacion({
      title: data.title,
      content: data.content,
      image: data.image,
      category_title: data.category_title,
      user_id: userId
    });

    const publicacion = await obtenerPublicacionPorId(newPostId);

    const resp = created("Publicacion creada exitosamente", publicacion);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const actualizarPublicacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const autor = await obtenerPublicacionConAutor(id);
    if (!autor) {
      return sendResponse(
        res,
        notFound("La publicacion no existe")
      );
    }

    if (autor.user_id !== req.user?.id) {
      return sendResponse(
        res,
        forbidden("No tienes permiso para editar esta publicacion")
      );
    }

    const parseResult = publicacionSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errores = parseResult.error.issues.map((e) => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        unprocessable("Error de validacion en la publicacion", errores)
      );
    }

    const data = parseResult.data;

    await actualizarPublicacion(id, {
      title: data.title,
      content: data.content,
      image: data.image,
      category_title: data.category_title
    });

    const publicacionActualizada = await obtenerPublicacionPorId(id);

    const resp = ok("Publicacion actualizada correctamente", publicacionActualizada);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const eliminarPublicacionController = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return sendResponse(
        res,
        badRequest("El id de la publicacion debe ser un numero")
      );
    }

    const autor = await obtenerPublicacionConAutor(id);
    if (!autor) {
      return sendResponse(
        res,
        notFound("La publicacion no existe")
      );
    }

    if (autor.user_id !== req.user?.id) {
      return sendResponse(
        res,
        forbidden("No tienes permiso para eliminar esta publicacion")
      );
    }

    const eliminadas = await eliminarPublicacionYComentarios(id);

    if (eliminadas === 0) {
      return sendResponse(
        res,
        notFound("La publicacion no existe")
      );
    }

    const resp = ok("Publicacion eliminada correctamente", null);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const listarCategorias = async (req, res, next) => {
  try {
    const categorias = await obtenerCategorias();
    const resp = ok("Categorias obtenidas correctamente", categorias);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};