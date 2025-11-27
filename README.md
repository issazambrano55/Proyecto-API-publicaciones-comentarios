# Proyecto-API-publicaciones-comentarios# Proyecto-API-publicaciones-comentarios


## Tecnologias utilizadas 

-Node.js – Entorno de ejecución JavaScript
-Express – Framework para construcción de APIs REST
-MySQL2 – Cliente para conexión MySQL
-argon2 – Encriptación de contraseñas
-jsonwebtoken (JWT) – Autenticación mediante tokens
-dotenv – Manejo de variables de entorno
-cors – Seguridad para permitir peticiones externas
-zod – Validación de datos
-swagger-jsdoc – Generación de documentación
-swagger-ui-express – Interfaz interactiva de Documentación
-nodemon – Recarga automática en desarrollo


## 📦 Inicializar el proyecto de Node.js

Clona el repositorio:

git clone https://github.com/issazambrano55/Proyecto-API-publicaciones-comentarios
cd Proyecto-API-publicaciones-comentarios
-----------
npm install

Esto iniciara e instalara todas las dependecias necesarias. 

## Instrucciones para iniciar

### 1. Requisitos

Asegúrate de tener instalados:

- [Docker](https://www.docker.com/)

### 2. Levantar el contenedor

Desde la raíz del proyecto donde se encuentra el archivo docker-compose.yml, ejecuta:

bash
docker compose up -d 

Esto iniciará un contenedor MySQL con:

- Base de datos inicial: blogdb
- Tablas configuradas correctamente

## Configuracion de Variables de Entorno

### Variables de entorno dentro del Docker

| Parámetro           | Valor           |
| -------------       | -----------     |
| MYSQL_ROOT_PASSWORD | rootpassword  |
| MYSQL_DATABASE      | blogdb        |
| MYSQL_USER          | administrador |
| MYSQL_PASSWORD      | pumas2025     |

### Variables de entorno para la conexion 

| Parámetro         | Valor                              |
| ----------------- | ---------------------------------- |
| PORT            | 4000                             |
| SECRET_JWT_SEED |  mi_super_clave_secreta_123        |
| DB_PORT         | 3307                             |
| DB_HOST         | localhost                        |
| DB_USER         | administrador                    |
| DB_PASSWORD     | pumas2025                        |
| DB_NAME         | blogdb                           |



## 🧱 Tablas creadas


### users
| Campo          | Tipo         | Descripción                            |
| ---------------| -------------| ---------------------------------------|
| id           | INT          | INT AUTO_INCREMENT como PK             |
| name         | VARCHAR(255) | Nombre completo del usuario (unico)    |
| email        | VARCHAR(255) | Correo electrónico (único)             |
| password_hash| VARCHAR(255) | Contraseña almacenada en hash (argon2) |
| telefono     | VARCHAR(20)  | Numero de telefono del usuario         |
| about        | VARCHAR(255) | Informacion personal del usuario       |
| created_at   | TIMESTAMP    | Fecha de creacion del usuario          |

### categories
| Campo        | Tipo         | Descripción                   |
| ----------   | ------------ | ------------------------------|
| id         | INT          | INT AUTO_INCREMENT como PK    |
| title      | VARCHAR(255) | Nombre de la categoria (unico)|
| description| VARCHAR(255) | Descripcion de la categoria   |

### post
| Campo        | Tipo        | Descripción                                |
| ------------ | ----------- | ------------------------------------------ |
| id         | INT         | Identificador único (PK, auto incremental) |
| title      | VARCHAR(15) | Titulo de la publicacion                   |
| content    | TEXT        | Informacion sobre la publicacion           |
| image      | VARCHAR(15) | imagen                                     |
| created_at | TIMESTAMP   | Fecha de creacion del post                 |
| user_id    | INT         | usuario de la personaque creo el post      |
| category_id| INT         | user de categoria en que registro el post  |
| nombre     | VARCHAR(15) | Nombre del periodo académico               |
|user_id       |     INT FK  | REFERENCES users(id),                      |
| category_id  | FOREIGN KEY |REFERENCES categories(id)                   |

### comments
| Campo           | Tipo        | Descripción                                |
| --------------- | ----------- | ------------------------------------------ |
| id            | INT         | Identificador único (PK, auto incremental) |
| content       | VARCHAR(255)| informacion sobre la que se quiera comentar|
| created_at    | TIMESTAMP   | Fecha de creacion del post                 |
| post_id       | INT         | Id de la publicacion a la que se comento   |
| user_id       | INT         | Id del usuario que realizo el comentario   |


## Arrancar la aplicacion

npm run dev 


## ¿Como acceder a la documentación? 
-  Asegúrate de tener el servidor en ejecución
- Abre tu navegador web y accede a la siguiente URL:

http://localhost:PUERTO/api/docs

*PUERTO se configura como una de las variables de entorno. 

🛡️ Protección contra XSS
La API implementa protección contra ataques Cross-Site Scripting (XSS) en los comentarios mediante:

Sanitización de entradas usando funciones que reemplazan caracteres HTML peligrosos (<, >, &, comillas, etc.) por entidades seguras.

Validación estricta de campos con la librería zod, evitando que se envíen datos vacíos o con formato incorrecto.


📂 Estructura del Proyecto
Proyecto_DD_API_Comentarios/
│── controllers/
│     ├── auth_controller.js
│     ├── comentario_controllers.js
│     └── publicacion_controller.js
│
│── middlewares/
│     ├── errorHandler.js
│     ├── validarComentarios.js
│     └── verify_token.js
│
│── models/
│     ├── comentarioModel.js
│     ├── publicacion_Model.js
│     └── user_model.js
│
│── routes/
│     ├── auth_routes.js
│     ├── comentario_routes.js
│     └── publicacion_routes.js
│
│── schemas/
│     ├── comentarValidacion.js
│     ├── validators_publicacion.js
│     └── validators_user.js
│
│── db_docker/
│     ├── docker-compose.yml
│     └── init.sql
│
│── swagger/
│     └── swagger.js
│
│── utils/
│── server.js
│── package.json
│── .env.example