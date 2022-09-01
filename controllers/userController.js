const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
// importar momentjs:
const moment = require('moment');
const User = require('../models/userModel');
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

 async function login(req, res){
    const {email, password} = req.body;

    try {
        User.findOne({email: email}, async (err, userData) =>{
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                if(!userData){
                    res.status(400).send({msg: "Error: email doesn't exists"});
                }else{
                    const passwordCorrect = await bcryptjs.compare(password, userData.password);
                    if(!passwordCorrect){
                        res.status(403).send({msg: "Error: incorrect password"});
                    }else{
                        token =  await jwt.createToken(userData, "24h");

                        res.status(200).send({token: token});
                    }

                }
            }
        });

    }catch(error){
        req.status(500).send(error);
    }

}

function forgot(req, res){
    const email = req.body.email;
    if(!email)throw{msg: "Error: email cannot be null"}

    try{
        User.findOne({email: email}, async (err, userData)=>{
            if(err){
                res.status(400).send({msg: "Error: email doesn't exists"});
            }else{
                token =  await jwt.createToken(userData, "1h");

                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST, 
                    port: 2525,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });


                const mailOptions = { 
                    from: 'pytonicus@gmail.com',
                    to: userData.email,
                    subject: 'Reestablecer contraseña | Task Learn',
                    text: `http://localhost:3000/api/reset/${userData._id}/${token}`
                };

                transporter.sendMail(mailOptions, (err, response)=>{
                    if(err){
                        res.status(500).send({msg: "Server status error"});
                    }else{
                        res.status(200).send({msg: "Email has send"});
                    }
                });
            }
        });
    }catch(error){
        req.status(500).send(error);
    }
}

async function resetPassword(req, res){
    // recuperar el id y token de usuario:
    const {id, token} = req.params;
    // recuperamos la contraseña por partida doble:
    const {newPassword, repitePassword} = req.body;

    // decodificar token:
    const user_token = jwt.decodeToken(token, process.env.SECRET_KEY);


    // comprobar si las contraseñas son diferentes o el token ha caducado o el id son distintos:
    if(user_token.exp <= moment().unix()){
        res.status(400).send({msg: "Error: token has expired"});
    }else if(user_token.id !== id || newPassword !== repitePassword){
        res.status(403).send({msg: "Error: unauthorized request"});
    }else{
        // codificar contraseña:
        const salt = bcryptjs.genSaltSync(10);
        const password = await bcryptjs.hash(newPassword, salt);
        // actualizar contraseña nueva:
        User.findByIdAndUpdate(id, {password: password}, (err, result) =>{
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                res.status(200).send({msg: "Password change successfully"});
            }
        });
    }

}

module.exports = {
    postUser,
    login,
    forgot,
    resetPassword // exportar modulo
}