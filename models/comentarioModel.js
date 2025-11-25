import db from "../config/db.js";


export const getTodosLosComentarios = async () => {
  const [rows] = await db.query(`SELECT c.id, c.content, c.created_at, c.post_id, c.user_id,
  u.name  AS user_name, p.title AS post_title FROM comments c JOIN users u ON c.user_id = u.id
     JOIN posts p ON c.post_id = p.id ORDER BY c.created_at DESC`
  );
  return rows;
};


export const getComentariosByPostId = async (postId) => {
  const [rows] = await db.query(`SELECT c.id,c.content,c.created_at,c.user_id,u.name AS user_name
     FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC`,
    [postId]
  );
  return rows;
};


export const crearComentario = async ({ content, user_id, post_id }) => {
  const [result] = await db.query(
    `INSERT INTO comments (content, user_id, post_id)
     VALUES (?, ?, ?)`,
    [content, user_id, post_id]
  );

  return result.insertId; 
};


