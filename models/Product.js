const mongoose = require('mongoose');
const productSchema =  new mongoose.Schema({
    title:{
        type:String
    },
    price:{
        type:Number
    },
    desc:{
        type:String
    },
    rate:{
        type:Number
    },
    imgUrl:{
        type:{
            secureUrl:String,
            galleryName:String,
            publicId:String
        }
    }
})
module.exports = mongoose.model('products',productSchema)