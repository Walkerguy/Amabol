var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');

routes.get('/products', function (req, res) {
    res.contentType('application/json');

    res.status(200).json(products);

    // Product.find()
    //     .then(function (products) {
    //         res.status(200).json(products);
    //         console.log(products);
    //     })
    //     .catch((error) => {
    //         res.status(400).json(error);
    //     });
});

routes.get('/products/:id', function (req, res) {
    Product.find({ '_id' : ObjectId(req.params.id)})
        .then(function (product) {
            res.status(200).json(product);
            console.log(product);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/products', function(req, res) {
    var new_product = new Product(req.body);

    // new_product.save(function(err, task) {
    //   if (err)
    //     res.send(err);
    //     res.json(task);
    // });
    TopicPublisher.sendMessageWithTopic(new_product.toString(),"inventory.create");

    res.json(req.body);
});

routes.update('/products/:id/changeAmount', function(req, res) {
    var id = req.params.id;
    //var new_product = new Product(req.body);
    var oldAmount;
    
    // Product.find({ '_id' : ObjectId(req.params.id)})
    //     .then(function (product) {
    //         res.status(200).json(product);
    //         oldAmount = product.amount;
    //         console.log(product);
    //     })
    //     .catch((error) => {
    //         res.status(400).json(error);
    //     });

    // Product.findOneAndUpdate({
    //     query: { _id: ObjectId(id) },
    //     update: { $set: { amount: req.body.amount } }
    // });

    //var msg = { 'oldAmount' : oldAmount, 'newAmount' : req.body.amount}

    var msg = { 'oldAmount' : 0, 'newAmount' : req.body.amount}

    TopicPublisher.sendMessageWithTopic(new_product.toString(),"inventory.update");


    res.json(req.body);
});

routes.delete('/products/:id', function (req, res) {
    // Product.findOneAndDelete({ '_id' : ObjectId(req.params.id)})
    //     .then(function (res) {
    //         res.status(200).json({"msg": 'product deleted'});
    //         console.log(res);
    //     })
    //     .catch((error) => {
    //         res.status(400).json(error);
    //     });

    TopicPublisher.sendMessageWithTopic(new_product.toString(),"inventory.delete");

});

module.exports = routes;