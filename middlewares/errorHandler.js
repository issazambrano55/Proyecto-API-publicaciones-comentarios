export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  const status = err.status || 500;

  return res.status(status).json({
    success: false,
    message: err.message || "Error interno del servidor",
    errors: err.errors || null
  });
};
