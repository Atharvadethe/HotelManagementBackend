const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/Menu');

// Create a new menu item
router.post('/', async (req, res) => {
    try {
        const menuItemData = req.body;
        const menuItem = new MenuItem(menuItemData);
        const menu_data = await menuItem.save();
        console.log('Menu item saved');
        res.status(201).json(menu_data);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch all menu items
router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        console.log('Data fetched');
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch menu items by taste
router.get('/:taste', async (req, res) => {
    try {
        const tasteType = req.params.taste;
        if (['sweet', 'sour', 'spicy'].includes(tasteType)) {
            const data = await MenuItem.find({ taste: tasteType });
            console.log('Data fetched');
            res.status(200).json(data);
        } else {
            res.status(400).json({ error: 'Invalid taste' });
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a menu item by ID
router.put('/:id', async (req, res) => {
    try {
        const menuId = req.params.id;
        const updatedMenuData = req.body;
        const response = await MenuItem.findByIdAndUpdate(menuId, updatedMenuData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Menu Item not found' });
        }

        console.log('Data updated');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a menu item by ID
router.delete('/:id', async (req, res) => {
    try {
        const menuId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuId);

        if (!response) {
            return res.status(404).json({ error: 'Menu Item not found' });
        }

        console.log('Data deleted');
        res.status(200).json({ message: 'Menu Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
