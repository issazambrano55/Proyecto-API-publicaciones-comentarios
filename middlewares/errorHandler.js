import { internalError, sendResponse } from "../utils/utils.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error no controlado:", err);

  if (res.headersSent) {
    return next(err);
  }


  if (err.status && typeof err.success !== "undefined") {
    return res.status(err.status).json(err);
  }

  const resp = internalError("Error interno del servidor", {
    mensaje: err.message
  });

  return sendResponse(res, resp);
};
