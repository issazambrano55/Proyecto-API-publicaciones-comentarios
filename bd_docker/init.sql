USE blogdb;


CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  about VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255)
);


CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  category_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);



CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);



INSERT INTO categories (title, description) VALUES
('Belleza', 'Contenido sobre cuidado personal y estética'),
('Tecnología', 'Publicaciones sobre tecnología'),
('Musica', 'Contenido musical y artistas'),
('Cine', 'Contenido sobre películas y series'),
('Salud', 'Artículos sobre salud y bienestar'),
('Videojuegos', 'Contenido sobre juegos y consolas'),
('Viajes', 'Contenido sobre experiencias de viaje'),
('Educación', 'Publicaciones educativas'),
('Cultura', 'Contenido cultural y general');

