const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  id:{
    type: String,
    required: true
  },
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
        name: { type: String},
        description: { type: String},
        price: {type: Number}
    }],

    totalPrice: {
        type: Number  
    },

}, { collection: 'Order' });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;