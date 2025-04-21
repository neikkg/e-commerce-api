const express = require('express');
const router = express.Router();

const cartItemController = require('../controller/cartItemController.js');
const authenticate = require('../middleware/authenticate.js');

router.post('/', authenticate, cartItemController.addCartItem);
router.put('/:Id',authenticate, cartItemController.updateCartItem);
router.delete('/:cartItemId', authenticate, cartItemController.removeCartItem);

module.exports = router;