const express = require('express');
const app = require('../app');
const api = express.Router();
// importar el middleware:
const authMiddleware = require("../middlewares/authMiddleware");

const taskController = require("../controllers/taskController");

// añadir el middleware a todas las rutas:
api.post("/tasks", [authMiddleware.secureRoute], taskController.postTask);
api.get("/tasks", [authMiddleware.secureRoute], taskController.getTasks);
api.get("/tasks/:id", [authMiddleware.secureRoute], taskController.getTask);
api.put("/tasks/:id", [authMiddleware.secureRoute], taskController.putTask);
api.delete("/tasks/:id", [authMiddleware.secureRoute], taskController.deleteTask);
api.patch("/tasks/:id", [authMiddleware.secureRoute], taskController.changeTask);

module.exports = api;