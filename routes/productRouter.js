const express = require('express');
const { addProduct, getProduct, getProducts, updateProduct, deleteProduct, postProductImages } = require('../controller/productsController');
const router = express.Router();
router.post('/addProduct',addProduct)
router.get('/',getProducts)
router.get('/:id',getProduct)
router.put('/:id',updateProduct);
router.delete('/:id',deleteProduct);
router.post('/images',postProductImages)

module.exports = router;