const express = require("express");
const multiparty = require("connect-multiparty");
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadAvatarMiddleware = multiparty({uploadDir: './uploads/avatars'});

const api = express.Router();

/**
 * @swagger
 * components: 
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: nombre del usuario
 *              lastname:
 *                  type: string
 *                  description: apellidos del usuario
 *              email:
 *                  type: string
 *                  description: email del usuario (se usa para iniciar sesión)
 *              password:
 *                  type: string
 *                  description: contraseña del usuario
 *              avatar:
 *                  type: string
 *                  description: Imagen para el perfil de usuario
 *          required:
 *              - email
 *              - password
 *          example:
 *              email: pytonicus@gmail.com
 *              password: "1234"           
 */


// crear una petición post para registro en la documentación:
/**
 * @swagger
 * /api/register:
 *  post:
 *      summary: Crear nuevo usuario
 *      tags: [User]      
 *      description: Crea un nuevo usuario a partir de su email y password
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: El usuario ha sido creado
 *          500:
 *              description: El email ya existe
 * 
 */     
api.post("/register", userController.postUser);

// crear otra petición post para login en la documentación:
/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: Contraseña olvidada
 *      tags: [User]      
 *      description: Se le pasa un email al que enviará una url con los datos para crear nueva contraseña.
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'      
 *      responses:
 *          200:
 *              description: Se ha enviado el email
 *          400: 
 *              description: El email no existe
 * 
 */   
api.post("/login", userController.login);

// crear otra petición post para restaurar contraseña en la documentación:
/**
 * @swagger
 * /api/forgot:
 *  post:
 *      summary: Recuperar contraseña
 *      tags: [User]      
 *      description: Envía un email para restaurar la contraseña olvidada.
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: email del usuario (para recuperar contraseña)
 *                  
 *                      example:
 *                          email: pytonicus@gmail.com
 *      responses:
 *          200:
 *              description: Se ha iniciado sesión con éxito
 *          400: 
 *              description: El email no existe
 * 
 */   
api.post("/forgot", userController.forgot);

// crear petición put para restaurar contraseña en la documentación:
/**
 * @swagger
 * /api/reset/{id}/{token}:
 *  put:
 *      summary: Resetear contraseña
 *      tags: [User]      
 *      description: Recibe dos contraseñas que deben ser idénticas y genera una nueva contraseña.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de usuario
 *          - in: path
 *            name: token
 *            schema:
 *              type: string
 *            required: true
 *            description: token del usuario otorgado por el endpoint de arriba y que dura 1 hora 
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newPassword:
 *                              type: string
 *                              description: contraseña que va a sustituir la antigua.
 *                          repitePassword:
 *                              type: string
 *                              description: contraseña que debe ser exactamente igual a newPassword
 *                  
 *                      example:
 *                          newPassword: "5678"
 *                          repitePassword: "5678"
 *      responses:
 *          200:
 *              description: La contraseña se ha cambiado con éxito
 *          400: 
 *              description: El token ha expirado
 *          403: 
 *              description: Petición no autorizada
 *          404:
 *              description: El usuario no existe
 * 
 */   
api.put("/reset/:id/:token", userController.resetPassword);

// crear una petición get en la documentación:
/**
 * @swagger
 * /api/users:
 *  get:
 *      summary: Recuperar usuario
 *      tags: [User]      
 *      description: Recuperar datos del usuario (excepto contraseña)
 *      responses:
 *          200:
 *              description: Retorna los datos del usuario que coinciden con su token
 *          400: 
 *              description: El usuario no existe
 *          403: 
 *              description: Acceso no autorizado
 * 
 */ 
api.get("/users", [authMiddleware.secureRoute], userController.getUser);

// crear petición put para actualizar datos de usuario en la documentación:
/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *      summary: Actualizar usuario
 *      tags: [User]      
 *      description: Actualizar datos de usuario mediante formData para poder cargar imágenes en el servidor
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de usuario
 *      requestBody:
 *          required: true
 *          content: 
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: nombre de usuario.
 *                          lastname:
 *                              type: string
 *                              description: apellidos del usuario.
 *                          email:
 *                              type: string
 *                              description: email del usuario
 *                          password:
 *                              type: string
 *                              description: contraseña del usuario
 *                          avatar:
 *                              type: string
 *                              format: binary
 *                              description: avatar del usuario
 *                      example:
 *                          name: "Guillermo"
 *                          lastname: "Granados"
 *                          email: "pytonicus@gmail.com"
 *                          password: "5678"
 *                          avatar: "foto.jpg"
 *      responses:
 *          201:
 *              description: El usuario se ha actualizado
 *          403: 
 *              description: Petición no autorizada
 *          404:
 *              description: El usuario no existe
 * 
 */  
api.put("/users/:id", [authMiddleware.secureRoute, uploadAvatarMiddleware], userController.putUser);

// crear una petición get para recuperar imagen en la documentación:
/**
 * @swagger
 * /api/users/avatar/{avatar}:
 *  get:
 *      summary: Recuperar imagen
 *      tags: [User]      
 *      description: Recuperar imagen de avatar
 *      parameters:
 *          - in: path
 *            name: avatar
 *            schema:
 *              type: string
 *            required: true
 *            description: nombre del archivo
 *      responses:
 *          200:
 *              description: Muestra una imagen en el navegador
 *          404: 
 *              description: El avatar no existe
 * 
 */ 
api.get("/users/avatar/:avatarName", userController.getAvatar);

// crear una petición get para recuperar imagen en la documentación:
/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      summary: Elimina un usuario
 *      tags: [User]      
 *      description: Elimina por completo a un usuario y todas sus tareas
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id del usuario
 *      responses:
 *          200:
 *              description: se ha eliminado el usuario
 *          403:
 *              description: Petición no autorizada
 *          404: 
 *              description: El usuario no existe
 * 
 */ 
api.delete("/users/:id", [authMiddleware.secureRoute], userController.deleteUser);

module.exports = api;