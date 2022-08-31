const express = require("express");
const app = express();

// para trabajar con json se carga el modulo json de express:
app.use(express.json());
app.use(express.urlencoded({extended: true})); // también es necesaria la codificación

// importar modulo de las task routes: 
const taskRoutes = require('./routes/taskRoutes');

// crear punto de partida para las rutas de task:
app.use("/api", taskRoutes);

module.exports = app;