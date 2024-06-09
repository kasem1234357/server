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
    expectedTime:{
        type:Date,
        required:true
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    status:{
        type:String,
        enum:["waiting",'successed','failed'],
        default:"waiting"
    }
})
module.exports = mongoose.model('orders',OrderSchema)