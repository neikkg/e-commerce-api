const categoryService = require('../services/categoryService.js'); // Import the category service
const Product = require('../models/productModel.js'); // Import the Product model
const Category = require('../models/categoryModel.js'); // Import the Category model
const CartItem = require('../models/cartItemModel.js'); // Import the CartItem model
const Cart = require('../models/cartModel.js'); // Import the Cart model


// Create a new category
const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body); // Use the service
    res.status(201).json(category);
  } catch (error) {
    console.error("Error in createCategory:", error.message);
    res.status(500).json({ error: "Cannot create category" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories(); // Use the service
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", error.message);
    res.status(500).json({ error: "Cannot fetch categories" });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id); // Use the service
    res.status(200).json(category);
  } catch (error) {
    console.error("Error in getCategoryById:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a category by ID


const deleteCategoryById = async (req, res) => {
  const { id } = req.params; // Extract the category ID from the request parameters
  try {
    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find all products associated with this category
    const products = await Product.find({ category: id });

    // Extract product IDs
    const productIds = products.map((product) => product._id);

    // Delete all cart items referencing these products
    await CartItem.deleteMany({ product: { $in: productIds } });

    // Delete all carts that no longer have any cart items
    await Cart.deleteMany({ cartItems: { $size: 0 } });

    // Delete all products associated with this category
    await Product.deleteMany({ category: id });

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category, associated products, and related cart items deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategoryById:", error.message);
    res.status(500).json({ error: "Cannot delete category" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategoryById,
};