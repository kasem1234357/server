
const jwt = require("jsonwebtoken");
const util = require('util')
const dotenv = require("dotenv");
dotenv.config();
const verifyToken = async (token,secret)=>{
    return await util.promisify(jwt.verify)(token,secret)
}

module.exports = verifyToken