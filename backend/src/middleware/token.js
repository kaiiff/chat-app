const jwt = require("jsonwebtoken")


exports.encode = async(payload)=>{
    return await jwt.sign(payload,process.env.JWT_KEY,{expiresIn:"1d"})}