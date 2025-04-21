const express = require('express');
const router = express.Router();
const productController = require('../controller/productController.js');


router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProductById);

module.exports = router;
