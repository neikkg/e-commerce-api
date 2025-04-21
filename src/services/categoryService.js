const Category = require('../models/categoryModel.js'); // Import the Category model

// Create a new category
const createCategory = async (categoryData) => {
  try {
    const category = new Category(categoryData); // Create a new category instance
    return await category.save(); // Save the category to the database
  } catch (error) {
    throw new Error(error.message); // Throw the error to be handled in the controller
  }
};

// Get all categories
const getAllCategories = async () => {
  try {
    return await Category.find().populate('parentCategory', 'name'); // Populate parent category name
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a category by ID
const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId).populate('parentCategory', 'name');
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a category by ID
const deleteCategoryById = async (categoryId) => {
  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategoryById,
};