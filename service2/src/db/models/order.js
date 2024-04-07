const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Order', orderSchema);
