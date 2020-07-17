const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY ="askljl23j2kj23klj232kl3jk223jlkjn32kn";

exports.createAccessToken=(user)=>{
    const payload ={
        id:user._id,
        name:user.name,
        lastname:user.lastname,
        email:user.lastname,
        role:user.role,
        createToken:moment().unix(),
        exp:moment().add(3,"hours").unix()
    }

    return jwt.encode(payload,SECRET_KEY);
}

exports.createRefreshToken=(user)=>{
    const payload={
        id:user._id,
        exp:moment().add(30,"days").unix()
    };

    return jwt.encode(payload,SECRET_KEY);
}

exports.decodeToken=(token)=>{
    return jwt.decode(token,SECRET_KEY,true);
}