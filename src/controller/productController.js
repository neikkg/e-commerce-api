const mongoose = require('mongoose');
const productService = require('../services/productService');
const CartItem = require('../models/cartItemModel.js'); // Import CartItem model
const Product = require('../models/productModel.js'); // Import the Product model
const Category = require('../models/categoryModel.js'); // Import the Category model
const Cart = require('../models/cartModel.js')

const createProduct = async (req, res) => {
  try {
    const { category, ...productData } = req.body;

    console.log("Category from request:", category); // Debugging: Log the category

    // Validate the category ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID format" });
    }

    // Check if the category exists in the database
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Set the category ObjectId in the product data
    productData.category = categoryDoc._id;

    const product = await productService.createProduct(productData);
    res.status(201).json(product);
  } catch (err) {
    console.error("Error in createProduct:", err.message);
    res.status(500).json({ error: "Cannot create product" });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }); // Fetch only active products
    return res.status(200).send(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error.message); // Debugging: Log the error
    return res.status(500).send({ error: error.message });
  }
};


const getProductById = async (req, res) => {
  const { id } = req.params; // Extract the product ID from the request parameters
  try {
    const product = await Product.findById(id); // Fetch the product by ID
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    return res.status(200).send(product);
  } catch (error) {
    console.error("Error in getProductById:", error.message); // Debugging: Log the error
    return res.status(500).send({ error: error.message });
  }
};


const deleteProductById = async (req, res) => {
  const { id } = req.params; // Extract the product ID from the request parameters
  try {
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Mark the product as inactive (optional)
    product.isActive = false;
    await product.save();

    // Delete all cart items referencing this product
    await CartItem.deleteMany({ product: id });

    // Find all carts that reference this product
    const carts = await Cart.find({ cartItems: { $elemMatch: { product: id } } });

    for (const cart of carts) {
      // Remove cart items referencing the product
      cart.cartItems = cart.cartItems.filter((cartItem) => cartItem.product.toString() !== id);

      // If the cart is now empty, reset its totals
      if (cart.cartItems.length === 0) {
        cart.totalPrice = 0;
        cart.totalDiscountedPrice = 0;
        cart.totalItem = 0;
        cart.discount = 0;
        await cart.save();
      } else {
        // Otherwise, recalculate cart totals
        cart.totalPrice = 0;
        cart.totalDiscountedPrice = 0;
        cart.totalItem = 0;

        for (const cartItemId of cart.cartItems) {
          const cartItem = await CartItem.findById(cartItemId);
          if (cartItem) {
            cart.totalPrice += cartItem.price;
            cart.totalDiscountedPrice += cartItem.discountedPrice;
            cart.totalItem += cartItem.quantity;
          }
        }

        cart.discount = cart.totalPrice - cart.totalDiscountedPrice;
        await cart.save();
      }
    }

    // Optionally, delete the product from the database
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product, related cart items, and empty carts updated successfully" });
  } catch (error) {
    console.error("Error in deleteProductById:", error.message);
    res.status(500).json({ error: "Cannot delete product" });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById
};
