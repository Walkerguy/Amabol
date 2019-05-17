const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    Id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
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