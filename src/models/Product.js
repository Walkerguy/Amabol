const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },

    amount: {
        type: String,
        required: true
    },
    
    price: {
        type: Number,
        required: true
    }
});


const Product = mongoose.model('product', ProductSchema);

module.exports = Product;