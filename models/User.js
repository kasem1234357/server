const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    phone:{
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8,
        select:false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate:{
            validator:function(val){
               return this.password === val
            },
            message:`Password and confirm password don't match`
                
            
        }
    },
    role:{
     type:String,
     enum:['normal','admin','super_admin'],
     default:'normal'
    },
    passwordChangedAt:Date,
    resetPasswordToken:String,
    resetPasswordTokenExpires:Date
})













userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined
    next();
})














userSchema.methods.comparePasswordDB = async function(pass,passDB){
   return await bcrypt.compare(pass,passDB)
}
userSchema.methods.isPasswordChanged = async function(jwtTimestamp){
    console.log(this.passwordChangedAt ,jwtTimestamp )
 if(this.passwordChangedAt){
    const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
  return jwtTimestamp < passwordChangedTimestamp
 }
 return false
  
}

const User = mongoose.model('User', userSchema);

module.exports = User;