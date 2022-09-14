const express = require("express");
const app = express();
// importar swaggerUi y swaggerJsDoc:
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

// crear las especificaciones:
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Learn API documentation",
            version: "1.0.0"
        },
        servers: [
            {   // para que la docu funcione cambiamos este campo añadiendo la variable de entorno con la url del host:
                url: process.env.HOST_URL || "http://localhost:5000"
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization'
                }
            }
        },
        security: [
            {
                ApiKeyAuth: []
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cors());


const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');


app.use("/api", taskRoutes);
app.use("/api", userRoutes);
// creamos una ruta para la documentación:
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;