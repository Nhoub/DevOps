const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Order', orderSchema);
