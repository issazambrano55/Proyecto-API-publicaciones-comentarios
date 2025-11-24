import db from '../config/db.js';

/// Convierte nombre de categoría a su ID
const obtenerCategoryIdPorNombre = async (nombre) => {
  const [rows] = await db.execute(
    'SELECT category_id FROM category WHERE category_title = ?',
    [nombre]
  );
  return rows.length ? rows[0].category_id : null;
};

/// Obtiene todas las publicaciones con autor y categoría
export const obtenerPublicaciones = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.post_id,
      p.title,
      p.content_line1,
      p.content_line2,
      p.image,
      p.date,
      u.name AS autor,
      c.category_title AS categoria
    FROM post p
    JOIN user u ON p.user_user_id = u.user_id
    LEFT JOIN category c ON p.category_category_id = c.category_id
    ORDER BY p.date DESC
  `);
  return rows;
};

/// Crea una nueva publicación en la base de datos
export const crearPublicacion = async (post) => {
  const { title, content_line1, content_line2, image, category_title, user_user_id } = post;

  // resolver category_id por title
  const [[cat]] = await db.execute(
    'SELECT category_id FROM category WHERE category_title = ?',
    [category_title]
  );
  if (!cat) {
    throw new Error('La categoría no existe');
  }

  await db.execute(
    `INSERT INTO post (title, content_line1, content_line2, image, category_category_id, user_user_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      title,
      content_line1,
      content_line2 ?? null,
      image ?? null,
      cat.category_id,
      user_user_id
    ]
  );
};

/// Obtiene una publicación por su ID, incluyendo autor y categoría
export const obtenerPublicacionPorId = async (id) => {
  const [rows] = await db.execute(`
    SELECT 
      p.post_id,
      p.title,
      p.content_line1,
      p.content_line2,
      p.image,
      p.date,
      u.name AS autor,
      c.category_title AS categoria
    FROM post p
    JOIN user u ON p.user_user_id = u.user_id
    LEFT JOIN category c ON p.category_category_id = c.category_id
    WHERE p.post_id = ?
  `, [id]);

  return rows[0]; // Devuelve un solo objeto o undefined
};
export const obtenerPublicacionConAutor = async (post_id) => {
  const [rows] = await db.execute(`
    SELECT user_user_id FROM post WHERE post_id = ?
  `, [post_id]);
  return rows[0];
};

/// Actualiza una publicación existente por su ID
export const actualizarPublicacion = async (post_id, data) => {
  const { title, content_line1, content_line2, image, category_title } = data;

  const [[cat]] = await db.execute(
    'SELECT category_id FROM category WHERE category_title = ?',
    [category_title]
  );
  if (!cat) {
    throw new Error('La categoría no existe');
  }

  await db.execute(
    `UPDATE post
     SET title = ?, content_line1 = ?, content_line2 = ?, image = ?, category_category_id = ?
     WHERE post_id = ?`,
    [
      title,
      content_line1,
      content_line2 ?? null,
      image ?? null,
      cat.category_id,
      post_id
    ]
  );
};

// Eliminar publicación (y sus comentarios primero para no romper FK)
export const eliminarPublicacionYComentarios = async (post_id) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute('DELETE FROM comment WHERE post_post_id = ?', [post_id]);
    const [result] = await conn.execute('DELETE FROM post WHERE post_id = ?', [post_id]);

    await conn.commit();
    return result.affectedRows; 
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// Obtiene publicaciones con filtros y paginación
export const obtenerPublicacionesPaginadas = async ({ q = '', category = '', page = 1, pageSize = 10 }) => {
  const where = [];
  const params = [];

  if (q) {
    where.push('(p.title LIKE ? OR p.content_line1 LIKE ? OR p.content_line2 LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  if (category) {
    where.push('c.category_title = ?');
    params.push(category);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // total
  const [countRows] = await db.execute(
    `SELECT COUNT(*) as total
     FROM post p
     JOIN \`user\` u ON p.user_user_id = u.user_id
     LEFT JOIN category c ON p.category_category_id = c.category_id
     ${whereSql}`,
    params
  );
  const total = countRows[0]?.total ?? 0;

  // paginación
  const pageN = Math.max(1, Number(page) || 1);
  const sizeN = Math.min(50, Math.max(1, Number(pageSize) || 10));
  const offset = (pageN - 1) * sizeN;

  const [items] = await db.query( 
    `SELECT
       p.post_id,
       p.title,
       p.content_line1,
       p.content_line2,
       p.image,
       p.date,
       u.name AS autor,
       c.category_title AS categoria
     FROM post p
     JOIN \`user\` u ON p.user_user_id = u.user_id
     LEFT JOIN category c ON p.category_category_id = c.category_id
     ${whereSql}
     ORDER BY p.date DESC
     LIMIT ${sizeN} OFFSET ${offset}`,
    params 
  );

  return { items, total };
};

export const obtenerCategorias = async () => {
  const [rows] = await db.execute(
    'SELECT category_id, category_title, category_description FROM category ORDER BY category_title ASC'
  );
  return rows;
};