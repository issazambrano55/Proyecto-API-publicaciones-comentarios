
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

import {
  registerSchema,
  validateLogin
} from "../schemas/validators_user.js";


export const register = async (req, res, next) => {
  try {
    
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errores = result.error.errors.map(e => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        badRequest("Error de validación", errores)
      );
    }

    
    const { name, email, password, telefono, about } = result.data;

    
    const normalizedEmail = email.toLowerCase().trim();

    
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return sendResponse(
        res,
        badRequest("El correo electrónico ya está en uso")
      );
    }

    
    const existingName = await getUserByName(name);
    if (existingName) {
      return sendResponse(
        res,
        badRequest("El nombre de usuario ya está en uso")
      );
    }

    
    const password_hash = await argon2.hash(password, {
      type: argon2.argon2id
    });

    
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
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const result = validateLogin.safeParse(req.body);

    if (!result.success) {
      const errores = result.error.errors.map(e => ({
        campo: e.path.join("."),
        mensaje: e.message
      }));

      return sendResponse(
        res,
        badRequest("Error de validación", errores)
      );
    }

    const { email, password } = result.data;

    const normalizedEmail = email.toLowerCase().trim();

    
    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      return sendResponse(
        res,
        unauthorized("Credenciales inválidas")
      );
    }

    
    const validPassword = await argon2.verify(user.password_hash, password);
    if (!validPassword) {
      return sendResponse(
        res,
        unauthorized("Credenciales inválidas")
      );
    }

    
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    
    res.setHeader("Authorization",`Bearer ${token}`);

    const resp = ok("Inicio de sesión exitoso", { token });

    return sendResponse(res, resp);

  } catch (error) {
    next(error);
  }
};