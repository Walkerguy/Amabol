var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');
var uuidv1 = require('uuid/v1');

routes.get('/products', function (req, res) {
    res.contentType('application/json');
    Product.find()
        .then(function (products) {
            res.status(200).json(products);
            console.log(products);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/products/:id', function (req, res) {
    Product.find({ 'id' : req.params.id})
        .then(function (product) {
            res.status(200).json(product);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/products', function(req, res) {
    var new_product = new Product({
        id: uuidv1(),
        name: req.body.name,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price
    });

    new_product.save(function(err, task) {
        if (err){
            res.send(err);
        }
    });

    TopicPublisher.sendMessageWithTopic(JSON.stringify(new_product),"product.created");
        
    res.json(req.body);
    
});

routes.put('/products/:id', function(req, res) {
    var id = req.params.id;

    Product.find({ 'id' : id })
        .then(function (product) {
            var msg = { 'id': product.id, 'oldValue' : product.toString(), 'newValue' : req.body}
            TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.updated");
            Product.updateOne({ id: id },{ $set : req.body }).then(function (newProduct){
                res.status(200).json(newProduct);
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });

    
   
});

routes.delete('/products/:id', function (req, res) {
    Product.findOneAndDelete({ 'id' : req.params.id})
        .then(function (res) {
            res.status(200).json({"msg": 'product deleted'});
            console.log(res);
        })
        .catch((error) => {
            res.status(400).json(error);
        });

    TopicPublisher.sendMessageWithTopic(req.params.id,"product.deleted");

});

module.exports = routes;