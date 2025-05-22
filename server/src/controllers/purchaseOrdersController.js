const PurchaseOrder = require('../models/PurchaseOrder');

// Create a new purchase order
exports.createPurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = new PurchaseOrder(req.body);
        await purchaseOrder.save();
        res.status(201).json(purchaseOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all purchase orders
exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await PurchaseOrder.find();
        res.status(200).json(purchaseOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a purchase order by ID
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findById(req.params.id);
        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a purchase order by ID
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        res.status(200).json(purchaseOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a purchase order by ID
exports.deletePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrder = await PurchaseOrder.findByIdAndDelete(req.params.id);
        if (!purchaseOrder) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};