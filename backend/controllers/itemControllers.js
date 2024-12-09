const Item = require('../models/Item');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// Helper function to check if a value is empty
const isEmpty = (value) => !value || (typeof value === 'string' && value.trim().length === 0);

// Create a new item
const createItem = async (req, res) => {
  try {
    const { item_name, quantity, price, category } = req.body;

    // Validate required fields
    if (isEmpty(item_name) || isEmpty(quantity) || isEmpty(price) || isEmpty(category)) {
      return res.status(400).json({ error: 'All fields (item_name, quantity, price, category) are required and cannot be empty.' });
    }

    // Trim item name
    const trimmedName = item_name.trim();

    // Check if item with the same name exists (case-insensitive)
    const existingItem = await Item.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('item_name')),
        sequelize.fn('LOWER', trimmedName)
      ),
    });

    if (existingItem) {
      return res.status(409).json({ error: 'Item with the same name already exists.' });
    }

    await sequelize.query("ALTER TABLE items AUTO_INCREMENT = 1");

    // Create the new item
    const newItem = await Item.create({
      item_name: trimmedName,
      quantity,
      price,
      category,
    });

    res.status(201).json(newItem);
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an item by ID
const updateItemById = async (req, res) => {
  try {
    const { item_name, quantity, price, category } = req.body;
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Validate required fields
    if (isEmpty(item_name) || isEmpty(quantity) || isEmpty(price) || isEmpty(category)) {
      return res.status(400).json({ error: 'All fields (item_name, quantity, price, category) are required and cannot be empty.' });
    }

    // Trim item name
    const trimmedName = item_name.trim();

    // Check if an item with the same name exists (case-insensitive)
    const existingItem = await sequelize.query(
      `
        SELECT * 
        FROM items 
        WHERE item_id != :id 
        AND LOWER(item_name) = LOWER(:item_name)
        LIMIT 1
      `,
      {
        replacements: { id: parseInt(req.params.id), item_name: trimmedName },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (existingItem.length !== 0) {
      return res.status(409).json({ error: 'Another item with the same name already exists.' });
    }

    // Update the item
    await item.update({
      item_name: trimmedName,
      quantity,
      price,
      category,
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item by ID
const deleteItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await item.destroy();
    await sequelize.query("ALTER TABLE items AUTO_INCREMENT = 1");

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search for items by name or category (case-insensitive)
const searchItems = async (req, res) => {
  try {
    const { query } = req.query;

    if (isEmpty(query)) {
      return res.status(400).json({ error: 'Search query is required and cannot be empty.' });
    }

    const searchQuery = query.trim().toLowerCase();

    // Find items where the name or category matches the search query (case-insensitive)
    const items = await sequelize.query(
      `SELECT * FROM items WHERE LOWER(item_name) LIKE :searchQuery OR LOWER(category) LIKE :searchQuery`,
      {
        replacements: { searchQuery: `%${searchQuery}%` },
        type: QueryTypes.SELECT
      }
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
  searchItems,
};
