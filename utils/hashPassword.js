const crypto = require("crypto");
const dotenv = require('dotenv')
dotenv.config();
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  }
module.exports = hashPassword
