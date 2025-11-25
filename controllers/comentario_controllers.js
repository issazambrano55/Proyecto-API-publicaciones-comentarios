import { getTodosLosComentarios, getComentariosByPostId, crearComentario} from "../models/comentarioModel.js";
import {ok, created, badRequest, notFound, sendResponse} from "../utils/utils.js";
import { obtenerPublicacionPorId } from "../models/publicacionModel.js";


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
