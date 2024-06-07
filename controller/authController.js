const API = require("../classes/Api");
const User = require("./../models/User");
const Token = require('./../models/Token')
const ResetToken = require('./../models/ResetToken')
//)

const asyncErrorHandler = require("./../wrapper_functions/asyncErrorHandler");
const { signToken, verifyToken, generateResetToken } = require("../utils");
const sendToEmail = require("../utils/sendToEmail");


exports.signup = asyncErrorHandler(async (req, res) => {
  const api = new API(req, res);
  const newUser = await User.create(req.body);
  // create access token
  const accessToken = signToken(newUser._id);
  // create refresh token
  const refreshToken = signToken(newUser._id, "refresh");
  // store refresh token in database
   const newToken = await Token.create({token:refreshToken,userId:newUser._id})
   // send request to the client 
   newUser.save()
   const {password,...userData} = newUser._doc
  api.dataHandler("create", { accessToken, refreshToken:newToken.token, userData });
});
exports.login = asyncErrorHandler(async (req, res, next) => {
  const api = new API(req, res);
  const { email, password } = req.body;
  // check if user found 
  const user = await User.findOne({ email }).select("+password");
  if (!email || !password) {
    const error = api.errorHandler("uncomplated_data");
    next(error);
  }
  // check if password correct
  const isMatch = await user.comparePasswordDB(password, user.password);
  if (!user) {
    const error = api.errorHandler("not_found");
    next(error);
  }
  if (!isMatch) {
    const error = api.errorHandler("invalid");
    next(error);
  }
  // generate access token
  const accessToken = signToken(user._id);
  // generate refresh token
  const refreshToken = signToken(user._id, "refresh");
  // check if previous refresh token still found and deleted
  await Token.findOneAndDelete({userId:user._id})

  // store new refresh token in database
  const newToken = await Token.create({token:refreshToken,userId:user._id})
  // send access and refresh token to db
  api.dataHandler("create", { accessToken, refreshToken:newToken.token,
    userData:{name:user.name,userId:user._id }},'user log in and new tokens has been generated');
});
exports.token = asyncErrorHandler(async (req, res, next) => {
  const refreshToken = req.body.token;
  const api = new API(req, res);

  if (refreshToken == null){
    const error = api.errorHandler('unauthorized','your refreshToken not found')
    next(error)
  };
  let decodedToken =await verifyToken(refreshToken,process.env.REFRESH_TOKEN_SECRET)
  if(!decodedToken){
    const error = api.errorHandler('unauthorized')
    next(error)
  }
   const token = await Token.findOne({userId:decodedToken.id})
 
 
  
  if (!token || refreshToken !== token.token){
    const error = api.errorHandler('unauthorized','your token not valid anymore')
    next(error)
  }else{
    const accessToken = signToken(decodedToken.id);
    api.dataHandler("create", { accessToken},'new access token has been created');
  }
  
});
exports.logout = asyncErrorHandler(async (req, res, next) =>{
  const api = new API(req,res)
  const userId = req.user._id
  console.log(userId)
  await Token.findOneAndDelete({userId})
  api.dataHandler('delete')
})
exports.foregetPassword = asyncErrorHandler(async (req,res,next)=>{
  const user = await User.findOne({email:req.body.email})
  const api = new API(req,res)
  
  if(!user){
    const error = api.errorHandler('not_found','user not found check if the email correct')
    next(error)
  }
  const resetToken = generateResetToken()
  const newResetToken = await ResetToken.create({
    userID:user._id,
    token:resetToken
  })
await newResetToken.save()
  console.log(GET_RESET_PASSWORD_URL(`${process.env.FRONT_URL}/forgetPassword/${resetToken}`))
  const result = await sendToEmail({
    email:req.body.email,
    subject:'Reset Password',
    message:GET_RESET_PASSWORD_URL(`${process.env.FRONT_URL}/${resetToken}`)
  })

  if(result){
    api.dataHandler('create','reset token created its valid for 15 min')
  }else{
    await ResetToken.findByIdAndDelete(newResetToken._id)
    const error = api.errorHandler('uncomplated_data','something going wrong with send to email operation')
    next(error)
    
  }
 
  
})
exports.resetPassword =asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
  const resetUserToken = await ResetToken.find({token:req.body.resetToken})
  if(!resetUserToken){
    const error = api.errorHandler('invalid','your token in invalid')
    next(error)
  }
  const currentUser = await User.findById(resetUserToken.userId)
  if(!currentUser){
    const error = api.errorHandler('not_found','user not found')
    next(error)
  }
  if(req.body.newPassword.length === 0){
    const error = api.errorHandler('uncomplated_data')
    next(error)
  }
  const newHashedPassword = hashPassword(req.body.newPassword)
  up
  await currentUser.updateOne({$set:{password:newHashedPassword}})
  api.dataHandler('update')
})
exports.getUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
  const {userId} = api.getParams()
  const currentUser = await User.findById(userId)
  if(!currentUser){
    const error = api.errorHandler('not_found')
next(error)
  }
  api.dataHandler('fetch',{...currentUser._doc})
})