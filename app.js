const express = require("express");
const app = express();

// importar cors:
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
// habilitar todas las peticiones cors:
app.use(cors());

const taskRoutes = require('./routes/taskRoutes');
// cargar modulo rutas de usuarios:
const userRoutes = require('./routes/userRoutes');

app.use("/api", taskRoutes);
// cargar rutas de usuarios:
app.use("/api", userRoutes);

module.exports = app;