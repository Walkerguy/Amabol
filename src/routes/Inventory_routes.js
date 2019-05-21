var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');

routes.get('/products', function (req, res) {
    res.contentType('application/json');

    Product.find()
        .then(function (products) {
            res.status(200).json(products);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/products/:id', function (req, res) {
    Product.find({ 'id' : req.params.id})
        .then(function (product) {
            res.status(200).json(product);
            console.log(product);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

module.exports = routes;