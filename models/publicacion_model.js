import db from "../config/db.js";

export const getAllPublicaciones = async () => {
  const [rows] = await db.query(
    `SELECT p.id,
            p.title,
            p.content,
            p.image,
            p.created_at,
            p.user_id,
            u.name AS author_name,
            p.category_id,
            c.title AS category_title
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN categories c ON p.category_id = c.id
     ORDER BY p.created_at DESC`
  );

  return rows;
};
export const getPublicacionById = async (id) => {
  const [rows] = await db.query(
    `SELECT p.id,
            p.title,
            p.content,
            p.image,
            p.created_at,
            p.user_id,
            u.name AS author_name,
            p.category_id,
            c.title AS category_title
     FROM posts p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );

  return rows[0] || null;
};
export const createPublicacion = async ({
  title,
  content,
  image,
  user_id,
  category_id
}) => {
  const [result] = await db.query(
    `INSERT INTO posts (title, content, image, user_id, category_id)
     VALUES (?, ?, ?, ?, ?)`,
    [title, content, image, user_id, category_id ?? null]
  );

  return result.insertId;
};
export const updatePublicacion = async (
  id,
  { title, content, image, category_id }
) => {
  const [result] = await db.query(
    `UPDATE posts
     SET title = ?, content = ?, image = ?, category_id = ?
     WHERE id = ?`,
    [title, content, image, category_id ?? null, id]
  );

  return result.affectedRows > 0;
};
export const deletePublicacion = async (id) => {
  const [result] = await db.query(
    DELETE FROM posts WHERE id = ?,
    [id]
  );

  return result.affectedRows > 0;
};