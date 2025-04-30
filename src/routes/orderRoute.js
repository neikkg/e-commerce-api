// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModel.js');
// const jwt = require('jsonwebtoken');

// // Middleware to verify JWT
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     console.log("No token provided in request");
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }
//   try {
//     console.log("Verifying token:", token);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded JWT payload:", decoded);
//     req.userId = decoded.userId || decoded.id;
//     if (!req.userId) {
//       console.log("No userId or id in JWT payload:", decoded);
//       return res.status(401).json({ message: 'Invalid token: No user ID in payload' });
//     }
//     console.log("Authenticated userId:", req.userId);
//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err.message, err);
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token: Verification failed' });
//     }
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Invalid token: Token expired' });
//     }
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Get orders
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId, 'orders');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user.orders || []);
//   } catch (err) {
//     console.error('Get orders error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add order
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { items, total } = req.body;
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: 'Invalid order data: Items missing or not an array' });
//     }
//     if (typeof total !== 'number' || isNaN(total)) {
//       return res.status(400).json({ message: 'Invalid order data: Total must be a number' });
//     }
//     for (const item of items) {
//       if (!item.productId || !item.productName || !item.img || typeof item.price !== 'number' || !item.amount) {
//         return res.status(400).json({ message: 'Invalid order item: Missing required fields' });
//       }
//     }
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const order = {
//       items,
//       total,
//       timestamp: new Date()
//     };
//     user.orders.push(order);
//     user.cart = [];
//     await user.save();
//     res.json(order);
//   } catch (err) {
//     console.error('Add order error:', err.message, err);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// });

// module.exports = router;














const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const orderController = require('../controller/orderController.js');

router.get('/', authMiddleware, orderController.getOrders);
router.post('/', authMiddleware, orderController.addOrder);

module.exports = router;