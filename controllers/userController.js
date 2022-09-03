const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
// importar has de underscore para comprobar que existe una clave en un objeto:
const {has} = require('underscore');
const {_} = require('underscore');

const User = require('../models/userModel');
const jwt = require('../services/jwtService');
const authMiddleware = require('../middlewares/authMiddleware');

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
                    text: `http://localhost:3000/reset/${userData.id}/${token}` // ruta del frontend
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
    const {id, token} = req.params;
    const {newPassword, repitePassword} = req.body;

    const user_token = jwt.decodeToken(token, process.env.SECRET_KEY);


    if(user_token.exp <= moment().unix()){
        res.status(400).send({msg: "Error: token has expired"});
    }else if(user_token.id !== id || newPassword !== repitePassword){
        res.status(403).send({msg: "Error: unauthorized request"});
    }else{
        const salt = bcryptjs.genSaltSync(10);
        const password = await bcryptjs.hash(newPassword, salt);
        User.findByIdAndUpdate(id, {password: password}, (err, result) =>{
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else if(!result){
                res.status(404).send({msg: "Error: user doesn't exists"});
            }else{
                res.status(200).send({msg: "Password change successfully"});
            }
        });
    }

}

async function getUser(req, res){
    const user_token = await authMiddleware.getUser(req, res);

    try{
        const user = await User.findById(user_token.id);

        if(!user){
            res.status(400).send({msg: "Error: user doesn't exists"});
        }else if(user.id != user_token.id){ 
            res.status(403).send({msg: "Forbidden - Access to this resource on the server is denied!"});
        }else{
            user.password = null;
            res.status(200).send({user: user});
        }
    }catch(error){
        res.status(500).send(error);
    }
}

async function putUser(req, res){
    const userId = req.params.id;
    const params = req.body;
    
    const user_token = await authMiddleware.getUser(req, res);

    try{
        User.findById(userId, async (err, userData) => {
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else{
                if(!userData){
                    res.status(404).send({msg: "Error: user doesn't exists"});
                }else if(user_token.id !== userData.id){
                    res.status(403).send({msg: "Error: unauthorized request"});
                }else{
                    const salt = bcryptjs.genSaltSync(10);
                    userData.name = params.name;
                    userData.lastname = params.lastname;
                    userData.email = params.email; 
                    
                    if(params.password){
                        userData.password = await bcryptjs.hash(params.password, salt);
                    }

                    if(req.files.avatar){
                        const filePath = req.files.avatar.path;
                        let fileSplit = path.resolve(filePath).split(path.sep);
                        let filename = fileSplit[fileSplit.length-1];

                        let fileExt = filename.split(".");
                        if(fileExt[fileExt.length-1] !== "jpg" && fileExt[fileExt.length-1] !== "jpeg" && fileExt[fileExt.length-1] !== "png"){
                            fs.unlink(filePath, (err)=>{
                                if (err) throw console.error(err);
                                console.error("Only extension can be JPG or PNG");
                            });
                        }else{
                            if(userData.avatar){
                                const old_path = `./uploads/avatars/${userData.avatar}`;
                                fs.unlink(old_path, (err)=>{
                                    if (err) throw console.error(err);
                                });
                            }
                            userData.avatar = filename;
                        }
                    }

                    User.findByIdAndUpdate(userId, userData, (err, result) => {
                        if(err){
                            res.status(500).send({msg: "Server status error"});
                        }else if(!result){
                            res.status(404).send({msg: "Error: user doesn't exists"});
                        }else{
                            res.status(201).send({user: userData});
                        }
                    });

                }
            }
        });
    }catch(error){
        console.error(error);
    }
}

function getAvatar(req, res){
    const avatarName = req.params.avatarName;
    const filePath = `./uploads/avatars/${avatarName}`;

    fs.stat(filePath, (err, stat)=>{
        if(err){
            res.status(404).send({msg: "Error: Avatar doesn't exists"});
        }else{
            res.sendFile(path.resolve(filePath));
        }
    });
}

// crear función para eliminar usuarios:
async function deleteUser(req, res){
    // coger el parametro id:
    const user_token = await authMiddleware.getUser(req, res);
    const userId = req.params.id;

    try{
        // recuperar usuario a eliminar:
        User.findById(userId, (err, userData)=>{
            if(err){
                res.status(500).send({msg: "Server status error"});
            }else if(user_token.id !== userData.id){
                res.status(403).send({msg: "Error: unauthorized request"});
            }else{
                // evitar errores al cargar nombre de avatar:
                try{
                    var avatar = userData.avatar;
                }catch{
                    var avatar = null;
                }

                User.findByIdAndDelete(userId, (err, result)=>{
                    if(err){
                        res.status(500).send({msg: "Server status error"});
                    }else if(!result){
                        res.status(404).send({msg: "Error: User doesn't exist"});
                    }else{
                        // si existe un avatar lo eliminamos:
                        if(avatar){
                            const old_path = `./uploads/avatars/${avatar}`;
                            fs.unlink(old_path, (err)=>{
                                if (err) throw console.error(err);
                            });
                        }
                        res.status(200).send({msg: "User delete successfully"});
                    }
                });
            }
        });
    }catch(error){
        res.status(500).send({msg: "Server status error"});
    }
}

module.exports = {
    postUser,
    login,
    forgot,
    resetPassword,
    getUser,
    putUser,
    getAvatar,
    deleteUser // exportar modulo
}