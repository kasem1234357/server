const API = require("../classes/Api");
const Product = require("../models/Product");
const asyncErrorHandler = require("./../wrapper_functions/asyncErrorHandler");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const cloudinaryDelete = require("../utils/cloudinaryDelete");
const getProducts = asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
  api.modify(Product.find()).filter().sort().limitFields().paginate()
   const products = await api.query
   const total = await Product.countDocuments()
  api.dataHandler('fetch',{ products, total,length:products.length })
  })
  const getProduct =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
      // sort should look like this: { "field": "userId", "sort": "desc"}
      const product = await Product.findById(req.params.id);
     console.log(product)
      api.dataHandler('fetch',{...product._doc}) 
  })
  const updateProduct =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const product = await Product.findById(req.params.id);
    await product.updateOne({ $set: req.body });
   api.dataHandler('update')
})
const deleteProduct =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const {images}= req.body
    await cloudinaryDelete(images)
    const product = await Product.findById(req.params.id);
    if(!product){
      const error = api.dataHandler('not_found')
      next(error)
    }
    await product.deleteOne();
    api.dataHandler('delete')
})
const postProductImages =  asyncErrorHandler(async (req, res,next) => {
    const { imgData,galleryName} = req.body;
    const api = new API(req,res)
      let imgUrl = await cloudinaryUpload(imgData,galleryName);
      api.dataHandler('upload',{
        url: imgUrl.secure_url,
        public_id:imgUrl.public_id,
        galleryName:galleryName
      })
  })
  const addProduct = asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
    const newProduct = new Product(req.body)
    await newProduct.save();
    api.dataHandler('create')
  })
  module.exports = {
    getProducts,getProduct,updateProduct,deleteProduct,
    postProductImages,addProduct
  }