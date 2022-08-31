const express = require('express');
const app = require('../app');
const api = express.Router();

const taskController = require("../controllers/taskController");

api.post("/tasks", taskController.postTask);
api.get("/tasks", taskController.getTasks);
api.get("/tasks/:id", taskController.getTask);
api.put("/tasks/:id", taskController.putTask);
api.delete("/tasks/:id", taskController.deleteTask);
// ruta para actualizar tareas:
api.patch("/tasks/:id", taskController.changeTask);

module.exports = api;