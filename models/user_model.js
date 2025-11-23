
import db from "../config/db.js";


export const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?", 
    [email]
  );
  return rows[0] || null; 
};


export const getUserByName = async (name) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE name = ?", 
    [name]
  );
  return rows[0] || null;
};


export const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ?", 
    [id]
  );
  return rows[0] || null;
};


export const createUser = async ({ name, email, password_hash, telefono, about }) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash, telefono, about) VALUES (?, ?, ?, ?, ?)",
    [name, email, password_hash, telefono, about]
  );

  return result.insertId; 
};