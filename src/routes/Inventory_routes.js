var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');

routes.get('/products', function (req, res) {
    res.contentType('application/json');

    res.status(200).json(posts);

    // Product.find()
    //     .then(function (products) {
    //         res.status(200).json(products);
    //         console.log(products);
    //     })
    //     .catch((error) => {
    //         res.status(400).json(error);
    //     });
});

routes.post('/products', function(req, res) {
    var new_product = new Product(req.body);

    TopicPublisher.sendMessageWithTopic(new_product.toString(),"inventory.create");
    // new_product.save(function(err, task) {
    //   if (err)
    //     res.send(err);
    //     res.json(task);
    // });

    res.json(req.body);
});



module.exports = routes;