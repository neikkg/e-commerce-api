const express = require('express');
const router = express.Router();

const cartController = require('../controller/cartController.js');
const authenticate = require('../middleware/authenticate.js');

router.get('/',authenticate, cartController.findUserCart);
router.post('/add',authenticate, cartController.addItemToCart);
router.delete('/items', authenticate, cartController.deleteAllCartItems);

module.exports = router;