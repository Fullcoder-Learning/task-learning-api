const express = require("express");
const userController = require('../controllers/userController');

const api = express.Router();

api.post("/register", userController.postUser);
// crear ruta login:
api.post("/login", userController.login);


module.exports = api;