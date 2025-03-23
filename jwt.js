const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req,res,next)=>{
    const token  = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Token not provided'});
    }
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;  //add user info to request object for further usage
        next();
    }
    catch(err){
        return res.status(403).json({message:'Invalid token'});
    }
}

//function to generate token
const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:3000});
}

module.exports={jwtAuthMiddleware,generateToken};