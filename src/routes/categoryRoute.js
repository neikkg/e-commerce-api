const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController.js');

// Define routes for categories
router.post('/', categoryController.createCategory); // Create a new category
router.get('/', categoryController.getAllCategories); // Get all categories
router.get('/:id', categoryController.getCategoryById); // Get a category by ID
router.delete('/:id', categoryController.deleteCategoryById); // Delete a category by ID

module.exports = router;