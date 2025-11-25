import db from "../config/db.js";
export const obtenerPublicaciones = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.content_line1,
      p.content_line2,
      p.image,
      p.created_at,
      u.name AS autor,
      c.category_title AS categoria
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  return rows;
};
export const obtenerPublicacionPorId = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.content_line1,
      p.content_line2,
      p.image,
      p.created_at,
      u.name AS autor,
      c.category_title AS categoria
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, [id]);

  return rows[0];
};
export const crearPublicacion = async (data) => {
  const { title, content_line1, content_line2, image, category_title, user_id } = data;
  const [[cat]] = await db.query(
    "SELECT id FROM categories WHERE category_title = ?", 
    [category_title]
  );

  if (!cat) {
    throw new Error("La categoría no existe");
  }

  const [result] = await db.query(
    `INSERT INTO posts (title, content_line1, content_line2, image, category_id, user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      title,
      content_line1,
      content_line2 ?? null,
      image ?? null,
      cat.id,
      user_id
    ]
  );

  return result.insertId;
};
export const obtenerPublicacionConAutor = async (id) => {
  const [rows] = await db.query(
    "SELECT user_id FROM posts WHERE id = ?",
    [id]
  );

  return rows[0];
};
export const actualizarPublicacion = async (id, data) => {
  const { title, content_line1, content_line2, image, category_title } = data;

  // categoría → id
  const [[cat]] = await db.query(
    "SELECT id FROM categories WHERE category_title = ?", 
    [category_title]
  );

  if (!cat) {
    throw new Error("La categoría no existe");
  }

  await db.query(
    `UPDATE posts
     SET title = ?, content_line1 = ?, content_line2 = ?, image = ?, category_id = ?
     WHERE id = ?`,
    [
      title,
      content_line1,
      content_line2 ?? null,
      image ?? null,
      cat.id,
      id
    ]
  );
};
export const eliminarPublicacionYComentarios = async (id) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM comments WHERE post_id = ?", [id]);
    const [result] = await conn.query(
      "DELETE FROM posts WHERE id = ?",
      [id]
    );

    await conn.commit();
    return result.affectedRows;

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
export const obtenerCategorias = async () => {
  const [rows] = await db.query(`
    SELECT 
      id,
      category_title,
      category_description
    FROM categories
    ORDER BY category_title ASC
  `);

  return rows;
};
