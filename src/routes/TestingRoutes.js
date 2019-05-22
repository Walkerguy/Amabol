var express             = require('express');
var routes              = express.Router();
var Account             = require('../models/Account');
var Product             = require('../models/Product');
var Shoppingcart        = require('../models/Shoppingcart');

routes.get('/account', function (req, res, next) {
    Account.find()
        .then((accounts) => res.send(accounts))
        .catch(next);
});

routes.get('/product', function (req, res, next) {
    Product.find()
        .then((products) => res.send(products))
        .catch(next);
});

routes.get('/shoppingcart', function (req, res, next) {
    Shoppingcart.find()
        .then((shoppingcarts) => res.send(shoppingcarts))
        .catch(next);
});

module.exports = routes;