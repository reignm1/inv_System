const Stock = require('../models/Stock');

// Get all stock items
exports.getAllStock = async (req, res) => {
    try {
        const stockItems = await Stock.find();
        res.status(200).json(stockItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stock item by ID
exports.getStockById = async (req, res) => {
    try {
        const stockItem = await Stock.findById(req.params.id);
        if (!stockItem) return res.status(404).json({ message: 'Stock item not found' });
        res.status(200).json(stockItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new stock item
exports.createStock = async (req, res) => {
    const stockItem = new Stock(req.body);
    try {
        const savedStock = await stockItem.save();
        res.status(201).json(savedStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update stock item
exports.updateStock = async (req, res) => {
    try {
        const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStock) return res.status(404).json({ message: 'Stock item not found' });
        res.status(200).json(updatedStock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete stock item
exports.deleteStock = async (req, res) => {
    try {
        const deletedStock = await Stock.findByIdAndDelete(req.params.id);
        if (!deletedStock) return res.status(404).json({ message: 'Stock item not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};