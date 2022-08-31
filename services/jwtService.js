// importar jwt:
const jwt = require("jsonwebtoken");

// crear la clave secreta (escribe algo aleatorio):
const SECRET_KEY = "2ha9df238dhha87d8vaq";

// crear token:
function createToken(user, expiresIn){
    // recuperamos el id y el email del objeto user:
    const {id, email} = user;
    // y lo añadimos al payload:
    const payload = {id, email}

    // utilizamos el payload para retornar el token tras iniciar sesión:
    return jwt.sign(payload, SECRET_KEY, {expiresIn: expiresIn});
}

// crear uan función para decodificar el token:
function decodeToken(token){
    return jwt.decode(token, SECRET_KEY);
}

// exportar las dos funciones para crear y decodificar token:
module.exports = {
    createToken,
    decodeToken
}