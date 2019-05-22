const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  id:{
    type: String,
    required: true
  },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    adress: {
        type: String,
        required: true
    },
    postalcode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});


const Account = mongoose.model('account', AccountSchema);

module.exports = Account;