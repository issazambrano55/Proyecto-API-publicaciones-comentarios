
export const HTTP_CODES = Object.freeze({
 

 
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

 

  INTERNAL_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
});

const buildResponse = (status, success, message, extra = {}) => ({
  status,
  success,
  message,
  ...extra,
});


export const ok = (message = "Operación exitosa", data = null) =>
  buildResponse(HTTP_CODES.OK, true, message, { data });

export const created = (message = "Recurso creado exitosamente", data = null) =>
  buildResponse(HTTP_CODES.CREATED, true, message, { data });

export const accepted = (message = "Solicitud aceptada", data = null) =>
  buildResponse(HTTP_CODES.ACCEPTED, true, message, { data });

export const noContent = (message = "Sin contenido") =>
  buildResponse(HTTP_CODES.NO_CONTENT, true, message, { data: null });




export const badRequest = (message = "Solicitud incorrecta", errors = null) =>
  buildResponse(HTTP_CODES.BAD_REQUEST, false, message, { errors });

export const unauthorized = (message = "No autorizado") =>
  buildResponse(HTTP_CODES.UNAUTHORIZED, false, message);

export const forbidden = (message = "Acceso prohibido") =>
  buildResponse(HTTP_CODES.FORBIDDEN, false, message);

export const notFound = (message = "Recurso no encontrado") =>
  buildResponse(HTTP_CODES.NOT_FOUND, false, message);

export const methodNotAllowed = (message = "Método no permitido") =>
  buildResponse(HTTP_CODES.METHOD_NOT_ALLOWED, false, message);

export const conflict = (message = "Conflicto en la solicitud") =>
  buildResponse(HTTP_CODES.CONFLICT, false, message);

export const unsupportedMedia = (
  message = "Tipo de archivo o formato no soportado"
) => buildResponse(HTTP_CODES.UNSUPPORTED_MEDIA_TYPE, false, message);

export const unprocessable = (message = "Datos inválidos", errors = null) =>
  buildResponse(HTTP_CODES.UNPROCESSABLE_ENTITY, false, message, { errors });

export const tooManyRequests = (message = "Demasiadas solicitudes") =>
  buildResponse(HTTP_CODES.TOO_MANY_REQUESTS, false, message);



export const internalError = (
  message = "Error interno del servidor",
  details = null
) => buildResponse(HTTP_CODES.INTERNAL_ERROR, false, message, { details });

export const notImplemented = (message = "Funcionalidad no implementada") =>
  buildResponse(HTTP_CODES.NOT_IMPLEMENTED, false, message);

export const badGateway = (message = "Puerta de enlace incorrecta") =>
  buildResponse(HTTP_CODES.BAD_GATEWAY, false, message);

export const serviceUnavailable = (message = "Servicio no disponible") =>
  buildResponse(HTTP_CODES.SERVICE_UNAVAILABLE, false, message);

export const gatewayTimeout = (message = "Tiempo de espera agotado") =>
  buildResponse(HTTP_CODES.GATEWAY_TIMEOUT, false, message);



export const sendResponse = (res, respObj) => {
  return res.status(respObj.status).json(respObj);
};
