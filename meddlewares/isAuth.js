const API = require("../classes/Api");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");

const User = require("../models/User");
const { verifyToken } = require("../utils");

const isAuth = asyncErrorHandler(async (req,res,next)=>{
    //1- read he token & check if it exits
    const api = new API(req,res)
       const accessTestToken = req.headers.authorization
       let token;
       if(accessTestToken && accessTestToken.startsWith('Bearer')){
        token = accessTestToken.split(' ')[1]
        console.log(token);
      }
      if(!token){
       next(api.errorHandler('unauthorized','you are not logged in'))
      }

    // 2- validate the token 
      let decodedToken = await verifyToken(token,process.env.ACCESS_TOKEN_SECRET) 
      console.log(decodedToken);
      //await verifyToken(token,process.env.ACCESS_TOKEN_SECRET)

    // 3- if the user exits 
      const user = await User.findById(decodedToken.id)
      if(!user){
        next(api.errorHandler('not_found'))
      }
     
    // 4- if the user changed password after token was issued 
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat)
    if(isPasswordChanged){
        next(api.errorHandler('unauthorized','the password has been changed early please try to login again'))
    } 
    // 5- allow user to access route 
         req.user = user
    next()

})
module.exports = isAuth
