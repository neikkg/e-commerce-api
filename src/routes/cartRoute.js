// const express = require('express');
// const router = express.Router();
// const User = require('../models/userModel');
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

// // Get cart
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId, 'cart');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     console.log("Returning cart:", user.cart || []);
//     res.json(user.cart || []);
//   } catch (err) {
//     console.error('Get cart error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add/update cart item
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { productId, productName, img, price, discountPrice, amount } = req.body;
//     if (!productId || !productName || !img || !price || amount === undefined) {
//       return res.status(400).json({ message: 'Invalid cart item data' });
//     }
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     if (amount <= 0) {
//       user.cart = user.cart.filter(item => item.productId !== productId);
//     } else {
//       const existingItem = user.cart.find(item => item.productId === productId);
//       if (existingItem) {
//         existingItem.amount = amount;
//         existingItem.productName = productName;
//         existingItem.img = img;
//         existingItem.price = price;
//         existingItem.discountPrice = discountPrice;
//       } else {
//         user.cart.push({ productId, productName, img, price, discountPrice, amount });
//       }
//     }
//     await user.save();
//     res.json(user.cart);
//   } catch (err) {
//     console.error('Add cart error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Clear cart
// router.delete('/', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     user.cart = [];
//     await user.save();
//     res.json({ message: 'Cart cleared' });
//   } catch (err) {
//     console.error('Clear cart error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;





















const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log("No token provided in request");
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT payload:", decoded);
    req.userId = decoded.userId || decoded.id;
    if (!req.userId) {
      console.log("No userId or id in JWT payload:", decoded);
      return res.status(401).json({ message: 'Invalid token: No user ID in payload' });
    }
    console.log("Authenticated userId:", req.userId);
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message, err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token: Verification failed' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token: Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Returning cart for user:", req.userId, user.cart || []);
    res.json(user.cart || []);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add/update cart item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, productName, img, price, discountPrice, amount } = req.body;
    if (!productId || !productName || !img || !price || amount === undefined) {
      return res.status(400).json({ message: 'Invalid cart item data' });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (amount <= 0) {
      user.cart = user.cart.filter(item => item.productId !== productId);
    } else {
      const existingItem = user.cart.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.amount = amount;
        existingItem.productName = productName;
        existingItem.img = img;
        existingItem.price = price;
        existingItem.discountPrice = discountPrice;
      } else {
        user.cart.push({ productId, productName, img, price, discountPrice, amount });
      }
    }
    await user.save();
    console.log("Updated cart for user:", req.userId, user.cart);
    res.json(user.cart);
  } catch (err) {
    console.error('Add cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Clear cart request received for user:", req.userId);
    user.cart = [];
    await user.save();
    console.log("Cart cleared for user:", req.userId);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;