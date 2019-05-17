const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    // Who made the order.
    buyer:{
        type: Schema.Types.ObjectId,
        ref: "Account"
    },

    // Status options: 'Processing.', 'Confirmed.', 'Delivery sent.'.
    status: {
        type: String,
        default: "Processing."
    },

    // Products array.
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]

}, { collection: 'Order' });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
