const express = require('express');
const app = require('../app');
const api = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const taskController = require("../controllers/taskController");

/**
 * @swagger
 * components: 
 *  schemas:
 *      Task:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: título de la tarea
 *              description:
 *                  type: string
 *                  description: descripción de la tarea
 *              is_complete:
 *                  type: boolean
 *                  description: cambia a true si la tarea esta finalizada
 *              date_created:
 *                  type: string
 *                  description: fecha de creación de la tarea
 *              date_finish:
 *                  type: string
 *                  description: fecha de finalización de la tarea
 *              owner:
 *                  type: string
 *                  description: id del propietario de la tarea
 *          required:
 *              - name
 *              - description
 *          example:
 *              name: Comprar galletas
 *              description: ir a comprar galletas al super           
 */


// crear una petición post en la documentación:
/**
 * @swagger
 * /api/tasks:
 *  post:
 *      summary: Crear nueva tarea
 *      tags: [Task]      
 *      description: Crea una nueva tarea y retorna la misma como resultado.
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          201:
 *              description: Retorna la tarea ya creada
 *          400: 
 *              description: No se puede crear la tarea
 *          403: 
 *              description: No se han provisto las credenciales
 * 
 */     
api.post("/tasks", [authMiddleware.secureRoute], taskController.postTask);

// crear una petición get en la documentación:
/**
 * @swagger
 * /api/tasks:
 *  get:
 *      summary: Listado de tareas
 *      tags: [Task]      
 *      description: Recuperar listado de tareas de cada usuario.
 *      responses:
 *          200:
 *              description: Retorna un litado de tareas
 *          400: 
 *              description: No se puede obtener las tareas
 *          403: 
 *              description: No se han provisto las credenciales
 * 
 */   
api.get("/tasks", [authMiddleware.secureRoute], taskController.getTasks);

// crear una petición get en la documentación de una tarea:
/**
 * @swagger
 * /api/tasks/{id}:
 *  get:
 *      summary: Recuperar una tarea
 *      tags: [Task]      
 *      description: Recuperar tarea de un usuario a través de su id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de la tarea      
 *      responses:
 *          200:
 *              description: Retorna una tarea
 *          400: 
 *              description: No se puede obtener la tarea
 *          403: 
 *              description: No se han provisto las credenciales
 * 
 */   
api.get("/tasks/:id", [authMiddleware.secureRoute], taskController.getTask);

// crear una petición put en la documentación de una tarea:
/**
 * @swagger
 * /api/tasks/{id}:
 *  put:
 *      summary: Modificar una tarea
 *      tags: [Task]      
 *      description: Modificar tarea de un usuario a través de su id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de la tarea    
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Task'  
 *      responses:
 *          201:
 *              description: Actualiza una tarea
 *          400: 
 *              description: La tarea no existe
 *          403: 
 *              description: No se han provisto las credenciales
 *          404: 
 *              description: La tarea no existe
 * 
 */   
api.put("/tasks/:id", [authMiddleware.secureRoute], taskController.putTask);

// crear una petición put en la documentación de una tarea:
/**
 * @swagger
 * /api/tasks/{id}:
 *  delete:
 *      summary: Eliminar una tarea
 *      tags: [Task]      
 *      description: Eliminar tarea de un usuario a través de su id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de la tarea    
 *      responses:
 *          201:
 *              description: Actualiza una tarea
 *          400: 
 *              description: La tarea no existe
 *          403: 
 *              description: No se han provisto las credenciales
 *          404: 
 *              description: La tarea no existe
 * 
 */   
api.delete("/tasks/:id", [authMiddleware.secureRoute], taskController.deleteTask);

// crear una petición put en la documentación de una tarea:
/**
 * @swagger
 * /api/tasks/{id}:
 *  patch:
 *      summary: Finalizar una tarea
 *      tags: [Task]      
 *      description: Finaliza la tarea de un usuario a través de su id.
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id de la tarea    
 *      responses:
 *          200:
 *              description: Actualiza una tarea
 *          400: 
 *              description: La tarea no existe
 *          403: 
 *              description: No se han provisto las credenciales
 *          404: 
 *              description: La tarea no existe
 * 
 */   
api.patch("/tasks/:id", [authMiddleware.secureRoute], taskController.changeTask);

module.exports = api;