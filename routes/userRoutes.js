const express = require("express");
const userController = require('../controllers/userController');

const api = express.Router();

api.post("/register", userController.postUser);
api.post("/login", userController.login);
api.post("/forgot", userController.forgot);
// cargar ruta para cambiar contraseña:
api.put("/reset/:id/:token", userController.resetPassword);


module.exports = api;