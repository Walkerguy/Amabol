const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
  id: {type: String, required: true},
  deliveryAddress: {type: String, required: true},
  status: {type: String},
  products: {type: Array}
})

const Shipping = mongoose.model('shipping',ShippingSchema);
module.exports = Shipping;

//Topic:
// shipping.delivered