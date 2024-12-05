const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemControllers'); // Import item controller

// Routes for items

router.get('/', itemController.getAllItems); // Get all items
router.get('/search', itemController.searchItems); // Search for items by name or category
router.get('/:id', itemController.getItemById); // Get a specific item by ID
router.post('/', itemController.createItem); // Create a new item
router.put('/:id', itemController.updateItemById); // Update an item by ID
router.delete('/:id', itemController.deleteItemById); // Delete an item by ID

module.exports = router;
