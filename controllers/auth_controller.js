
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByEmail,
  getUserByName
} from "../models/user_model.js";

import {
  ok,
  created,
  unauthorized,
  badRequest,
  sendResponse
} from "../utils/utils.js";

// =========================
//       REGISTER
// =========================
export const register = async (req, res, next) => {
  try {
    const { name, email, password, telefono, about } = req.body;

    // Normalizar email
    const normalizedEmail = email?.toLowerCase().trim();

    // Validación mínima
    if (!name || !normalizedEmail || !password) {
      return sendResponse(
        res,
        badRequest("Faltan campos obligatorios (name, email, password)")
      );
    }

    // Buscar si correo ya existe
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return sendResponse(
        res,
        badRequest("El correo electrónico ya está en uso")
      );
    }

    // Buscar si el nombre ya existe
    const existingName = await getUserByName(name);
    if (existingName) {
      return sendResponse(
        res,
        badRequest("El nombre de usuario ya está en uso")
      );
    }

    // Hashear contraseña con Argon2
    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id
    });

    // Crear usuario (id autoincremental)
    const newUserId = await createUser({
      name,
      email: normalizedEmail,
      password_hash,
      telefono,
      about
    });

    const resp = created("Usuario creado exitosamente", {
      id: newUserId,
      name,
      email: normalizedEmail
    });

    return sendResponse(res, resp);

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return sendResponse(
        res,
        badRequest("El correo electrónico o nombre ya está en uso")
      );
    }

    next(error);
  }
};

// =========================
//          LOGIN
// =========================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validación simple
    if (!email || !password) {
      return sendResponse(
        res,
        badRequest("Email y password son obligatorios")
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Buscar usuario por email
    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      return sendResponse(
        res,
        unauthorized("Credenciales inválidas")
      );
    }

    // Verificar contraseña con Argon2
    const match = await argon2.verify(user.password_hash, password);
    if (!match) {
      return sendResponse(
        res,
        unauthorized("Credenciales inválidas")
      );
    }

    // Firmar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Enviar token en header y en body
    res.setHeader("Authorization", `Bearer ${token}`);

    const resp = ok("Inicio de sesión exitoso", { token });
    return sendResponse(res, resp);

  } catch (error) {
    next(error);
  }
};
