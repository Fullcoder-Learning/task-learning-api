const moment = require('moment');
const jwt = require('../services/jwtService');

const SECRET_KEY = "2ha9df238dhha87d8vaq";

function secureRoute(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({msg: "Error: authentication credentials are missing"});
    }

    const token = req.headers.authorization.replace(/['"]+/g, ""); // reemplazar las comillas simples por nada

    try {
        const payload = jwt.decodeToken(token, SECRET_KEY);

        if(payload.exp <= moment().unix()){
            return res.status(400).send({msg: "Error: token has expired"});
        }

        req.user = payload;
        next();
    }catch(error){
        return res.status(404).send({msg: "Error: Invalid token"});
    }
}

// crear función para recuperar usuarios:
function getUser(req, res){
    // recuperar token:
    const token = req.headers.authorization.replace(/['"]+/g, "");
    // decodificar token:
    const payload = jwt.decodeToken(token, SECRET_KEY);
    // retornar el payload:
    return payload;
}

module.exports = {
    secureRoute,
    getUser // exportar modulo
}