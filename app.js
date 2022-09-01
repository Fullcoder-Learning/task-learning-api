const express = require("express");
const app = express();

const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cors());

const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use("/api", taskRoutes);
app.use("/api", userRoutes);

module.exports = app;