const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
// importar servicio jwt:
const jwt = require('../services/jwtService');

async function postUser(req, res){
    const params = req.body;
    const user = new User(params);

    try{
        if(!params.email) throw{msg: "Error: email cannot be null"};
        if(!params.password) throw{msg: "Error: password cannot be null"};

        const emailExists = await User.findOne({email: params.email});
        if(emailExists) throw {msg: "Error: Email already exists"};

        const salt = bcryptjs.genSaltSync(10);
        user.password = await bcryptjs.hash(params.password, salt);
        
        user.save();
        res.status(201).send({user: user});
        
    }catch(error){
        res.status(500).send(error);
    }
}

 // crear función para hacer login:
 async function login(req, res){
    // recuperar el email y password del body:
    const {email, password} = req.body;

    try {
        // buscamos si existe el usuario por su email haciendo un callback asincrono:
        User.findOne({email: email}, async (err, userData) =>{
            // si el usuario no existe se lanza un mensaje de error:
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                if(!userData){
                    res.status(400).send({msg: "Error: email doesn't exists"});
                }else{
                    // comprobar la contraseña recibida con la contraseña encriptada:
                    const passwordCorrect = await bcryptjs.compare(password, userData.password);
                    // si la contraseña no es correcta avisar:
                    if(!passwordCorrect){
                        res.status(403).send({msg: "Error: incorrect password"});
                    }else{
                        // creamos el token que lleva el usuario la fecha de expiración del token (12 horas):
                        token =  await jwt.createToken(userData, "24h");

                        // se responde con  el token: 
                        res.status(200).send({token: token});
                    }

                }
            }
        });

        


    }catch(error){
        req.status(500).send(error);
    }

}

module.exports = {
    postUser,
    login // exportar modulo
}