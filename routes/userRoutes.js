const express = require("express");
const multiparty = require("connect-multiparty");
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadAvatarMiddleware = multiparty({uploadDir: './uploads/avatars'});

const api = express.Router();

api.post("/register", userController.postUser);
api.post("/login", userController.login);
api.post("/forgot", userController.forgot);
api.put("/reset/:id/:token", userController.resetPassword);
api.get("/users/:id", [authMiddleware.secureRoute], userController.getUser);
api.put("/users/:id", [authMiddleware.secureRoute, uploadAvatarMiddleware], userController.putUser);
api.get("/users/avatar/:avatarName", [authMiddleware.secureRoute], userController.getAvatar);
// ruta para eliminar usuarios:
api.delete("/users/:id", [authMiddleware.secureRoute], userController.deleteUser);

module.exports = api;