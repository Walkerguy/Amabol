const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
  deliveryAddress: {type: String, required: true},
  status: {type: String},
  product: {type: Array}
})

const Shipping = mongoose.model('shipping',ShippingSchema);
module.exports = Shipping;