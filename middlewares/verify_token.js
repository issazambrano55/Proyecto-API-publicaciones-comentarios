import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      success: false,
      message: "Token requerido"
    });
  }

  const [type, token] = header.split(" ");


  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Formato de token inválido"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name ?? null
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado"
    });
  }
};