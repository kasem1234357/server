const mongoose = require('mongoose')
const OrderSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    products:{
        type:[{
            productID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
            },
            count:Number
        }],
        
        required:true
    },
    expectedTime:{
        type:Date,
        required:true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('orders',OrderSchema)