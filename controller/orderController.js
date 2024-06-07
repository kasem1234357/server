const asyncErrorHandler = require("./../wrapper_functions/asyncErrorHandler");
const API = require("../classes/Api");
const Order = require("../models/Order");
const User = require("../models/User");
const getOrders = asyncErrorHandler(async(req,res,next)=>{
   const api = new API(req,res)
   api.modify(Order.find()).filter().sort().limitFields().paginate()
 const orders = await api.query
 api.dataHandler('fetch',{orders:[...orders]})
})
const getSingleOrder = asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
    const {orderId} = api.getParams()
    const order = await Order.findById(orderId)
    api.dataHandler('fetch',{...order._doc})
})
const getUserOrders = asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
    const {userId} = api.getParams()
    const userOrders = await Order.find({userId})
    api.dataHandler('fetch',{userOrders:[...userOrders],dataLength:userOrders.length})
})
const addOrder= asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
    const newOrder = new Order(req.body)
    await newOrder.save()
    api.dataHandler('create')
})
const updateOrder =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const order = await Order.findById(req.params.id);
    await order.updateOne({ $set: req.body });
   api.dataHandler('update')
})
const deleteOrder =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const order = await Order.findById(req.params.id);
    if(!order){
        const error = api.dataHandler('not_found')
        next(error)
      }
    await order.deleteOne();
    api.dataHandler('delete')
})
module.exports ={
    getOrders,getSingleOrder,getUserOrders,addOrder,deleteOrder,updateOrder
}