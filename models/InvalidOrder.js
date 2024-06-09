const mongoose = require('mongoose')
const OrderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    userNumber:{
        type:Number,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    products:{
        type:[{
            productID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
            },
            count:Number,
            price:Number,
            imgUrl:String,
            title:String,
        }],
        
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires:604800
    }
})
module.exports = mongoose.model('invalidOrders',OrderSchema)