import { getTodosLosComentarios, getComentariosByPostId, crearComentario, actualizarComentario,
  eliminarComentario} from "../models/comentarioModel.js";
import {ok, created, badRequest, notFound, forbidden, unprocessable, sendResponse} from "../utils/utils.js";

import { obtenerPublicacionPorId } from "../models/publicacion_model.js";


export const obtenerTodosLosComentarios = async (req, res, next) => {
  try {
    const comentarios = await getTodosLosComentarios();
    const resp = ok("Comentarios obtenidos correctamente", comentarios);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const obtenerComentariosPorPublicacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postId = Number(id);

    if (Number.isNaN(postId)) {
      return sendResponse(
        res,
        badRequest("El id de la publicación debe ser un número")
      );
    }

   
    const publicacion = await obtenerPublicacionPorId(postId);
    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicación no existe")
      );
    }

    const comentarios = await getComentariosByPostId(postId);
    const resp = ok("Comentarios obtenidos correctamente", comentarios);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const publicarComentario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postId = Number(id);

    if (Number.isNaN(postId)) {
      return sendResponse(
        res,
        badRequest("El id de la publicación debe ser un número")
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(
        res,
        badRequest("No se pudo identificar al usuario autenticado")
      );
    }


    const publicacion = await obtenerPublicacionPorId(postId);
    if (!publicacion) {
      return sendResponse(
        res,
        notFound("La publicación no existe")
      );
    }

    
    const { content } = req.validated || {};

    const newCommentId = await crearComentario({content, user_id: userId, post_id: postId});

    const resp = created("Comentario creado correctamente", {id: newCommentId, content, user_id: userId,
     post_id: postId});

    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const actualizarComentarioController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentarioId = Number(id);

    if (Number.isNaN(comentarioId)) {
      return sendResponse(
        res,
        badRequest("El id del comentario debe ser un número")
      );
    }

    const comentario = await getComentarioById(comentarioId);
    if (!comentario) {
      return sendResponse(
        res,
        notFound("El comentario no existe")
      );
    }

    if (comentario.user_id !== req.user?.id) {
      return sendResponse(
        res,
        forbidden("No tienes permiso para editar este comentario")
      );
    }

    const { content } = req.validated || {};
    if (!content) {
      return sendResponse(
        res,
        unprocessable("El contenido del comentario es obligatorio")
      );
    }

    const updated = await actualizarComentario(comentarioId, content);
    if (updated === 0) {
      return sendResponse(
        res,
        notFound("El comentario no existe o no se pudo actualizar")
      );
    }

    const comentarioActualizado = await getComentarioById(comentarioId);

    const resp = ok(
      "Comentario actualizado correctamente",
      comentarioActualizado
    );
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};


export const eliminarComentarioController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comentarioId = Number(id);

    if (Number.isNaN(comentarioId)) {
      return sendResponse(
        res,
        badRequest("El id del comentario debe ser un número")
      );
    }

    const comentario = await getComentarioById(comentarioId);
    if (!comentario) {
      return sendResponse(
        res,
        notFound("El comentario no existe")
      );
    }

    if (comentario.user_id !== req.user?.id) {
      return sendResponse(
        res,
        forbidden("No tienes permiso para eliminar este comentario")
      );
    }

    const deleted = await eliminarComentario(comentarioId);
    if (deleted === 0) {
      return sendResponse(
        res,
        notFound("El comentario no existe o ya fue eliminado")
      );
    }

    const resp = ok("Comentario eliminado correctamente", null);
    return sendResponse(res, resp);
  } catch (error) {
    next(error);
  }
};
