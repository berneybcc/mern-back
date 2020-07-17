const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const jwt = require("../services/jwt");

function signUp(req,res){
    const user = new User();

    const { name,lastname,email,password,repeatPassword } = req.body;
    user.name=name;
    user.lastname=lastname;
    user.email=email;
    user.role= "admin";
    user.active = false;

    if(!password || !repeatPassword){
        res.status(404).send({message:"La contraseña son obligatorias"});
    }else{
        if(password !== repeatPassword){
            res.status(404).send({message:"Las contraseñas no son iguales"});
        }else{
            bcrypt.hash(password,null,null,function(err,hash){
                if(err){
                    res.status(500).send({message:"Error al encriptar la contraseña"});
                }else{
                    user.password=hash;

                    user.save((err,userStored)=>{
                        if(err){
                            res.status(500).send({message:"Error al crear el usuario"});
                        }
                        else{
                            if(!userStored){
                                res.status(404).send({message:"Error al crear el usuario"});
                            }else{
                                res.status(200).send({
                                    message:"Usuario creado correctamente",
                                    user:userStored.email
                                });
                            }
                        }
                    });
                }
            })
        }
    }
}

function signIn(req,res){
    const { email,password } = req.body;
    email=email.toLowerCase();

    User.findOne({email},(error,userStored)=>{
        if(err){
            res.status(500).send({message:"Error del servidor"});
        }
        else{
            if(!userStored){
                res.status(404).send({message:"Usuario no encontrado"});
            }else{
                bcrypt.compare(password,userStored.password,(err,check)=>{
                    if(err){
                        res.status(500).send({message:"Error de servidor"});
                    }
                    else{
                        if(!userStored.active){
                            res.status(200).send({message:"Usuario no se encuentra activado"});
                        }else if(!check){
                            res.status(500).send({message:"La contraseña es Incorrecta"});
                        }else{
                            res.status(200).send({
                                accessToken:jwt.createAccessToken(userStored),
                                refreshToken:jwt.createRefreshToken(userStored)
                            })
                        }
                    }
                })
            }
        }
    })
}

module.exports={
    signUp,
    signIn
}