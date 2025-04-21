const Product = require('../models/productModel');


const createProduct = async (productData) => {
  try {
    const product = new Product(productData); // Create a new product instance
    return await product.save(); // Save the product to the database
  } catch (error) {
    throw new Error(error.message); // Throw the error to be caught in the controller
  }
};


const getAllProducts = async () => {
  return await Product.find().populate('category');
};


const getProductById = async (id) => {
  return await Product.findById(id).populate('category');
};


const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById
};