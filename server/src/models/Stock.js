const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;