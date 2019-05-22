const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingcartSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    account_id: {
        type: String,
        required: true
    },
    
    productIds: [{
        type: String
    }],
    
    totalPrice: {
        type: Number,
        required: true
    }
});

const Shoppingcart = mongoose.model('shoppingcart', ShoppingcartSchema);

module.exports = Shoppingcart;