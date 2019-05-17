const mongoose = require('mongoose');
const Product = require('./Product');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    products: [Product]
});


const Delivery = mongoose.model('delivery', DeliverySchema);

module.exports = Delivery;