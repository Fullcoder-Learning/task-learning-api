const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); 

const taskRoutes = require('./routes/taskRoutes');
// cargar modulo rutas de usuarios:
const userRoutes = require('./routes/userRoutes');

app.use("/api", taskRoutes);
// cargar rutas de usuarios:
app.use("/api", userRoutes);

module.exports = app;