var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var ShoppingCart = require('../models/ShoppingCart');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');
var uuidv1 = require('uuid/v1');

routes.get('/shoppingcarts', function (req, res) {
    res.contentType('application/json');
    ShoppingCart.find()
        .then(function (shoppingcarts) {
            res.status(200).json(shoppingcarts);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/shoppingcarts/:id', function (req, res) {
    ShoppingCart.find({ 'id' : req.params.id})
        .then(function (shoppingcart) {
            res.status(200).json(shoppingcart);
            console.log(shoppingcart);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/Shoppingcarts', function(req, res) {

    var new_shoppingcart = new ShoppingCart({
        id: uuidv1(),
        account_id: req.body.account_id,
        Products: [],
        totalPrice: 0 
    });

    new_shoppingcart.save(function(err, task) {
        if (err){
            res.send(err);
        }
        TopicPublisher.sendMessageWithTopic(new_shoppingcart.toString(),"shoppingcart.create");
        res.json(task);
    });
});

routes.put('/Shoppingcarts/:id/addProduct/:pid', function(req, res) {
    var pid = req.params.pid;
    var id = req.params.id;

    Product.find({ 'id' : pid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { _id: id },
                update: { $push: { products: product.id } }
            });
            ShoppingCart.findOneAndUpdate({
                query: { _id: id },
                update: { $inc: { totalPrice: product.price } }
            });
            TopicPublisher.sendMessageWithTopic({"id": id, "": ""},"shoppingcart.add");

            res.json(req.body);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
    

    
});

routes.put('/Shoppingcarts/:id/removeProduct/:pid', function(req, res) {
    var pid = req.params.pid;
    var id = req.params.id;

    Product.find({ 'id' : pid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { _id: id },
                update: { $pull: { products: product.id } }
            });
            ShoppingCart.findOneAndUpdate({
                query: { _id: id },
                update: { $inc: { totalPrice: -product.price } }
            });
            TopicPublisher.sendMessageWithTopic(new_product.toString(),"shoppingcart.remove");

            res.json(req.body);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
    

    
});

routes.delete('/Shoppingcarts/:id', function (req, res) {
    ShoppingCart.findOneAndDelete({ 'id' : req.params.id})
        .then(function (res) {
            res.status(200).json({"msg": 'Shoppingcart deleted'});
            console.log(res);
        })
        .catch((error) => {
            res.status(400).json(error);
        });

    TopicPublisher.sendMessageWithTopic(new_product.toString(),"shoppingcart.delete");

});

module.exports = routes;