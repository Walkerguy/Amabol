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
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/Shoppingcarts', function(req, res) {

    var new_shoppingcart = new ShoppingCart({
        id: uuidv1(),
        account_id: req.body.account_id,
        products: [],
        totalPrice: 0 
    });

    new_shoppingcart.save(function(err, task) {
        if (err){
            res.send(err);
        }
        TopicPublisher.sendMessageWithTopic(JSON.stringify(new_shoppingcart),"shoppingcart.created");
        res.status(200).json(new_shoppingcart);
    });
});

routes.put('/Shoppingcarts/:id/addProduct/:pid', function(req, res) {
    var productid = req.params.pid;
    var id = req.params.id;

    Product.find({ 'id' : productid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { id: id },
                update: { $push: { products: product.id } }
            }).then(() => {
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: product.price } }
                }).then(() => {
                    TopicPublisher.sendMessageWithTopic(JSON.stringify({"id": id, "product_id":productid}),"shoppingcart.added");
                    res.json(req.body);
                });
            });
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.put('/Shoppingcarts/:id/removeProduct/:pid', function(req, res) {
    var productid = req.params.pid;
    var id = req.params.id;

    Product.find({ 'id' : productid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { id: id },
                update: { $pull: { products: product.id } }
            }).then(()=>{
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: -product.price } }
                }).then(()=>{
                    TopicPublisher.sendMessageWithTopic(JSON.stringify({"id": id, "product_id":productid}),"shoppingcart.removed");
                    res.json(req.body);
                });
            });
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.delete('/Shoppingcarts/:id', function (req, res) {
    ShoppingCart.findOneAndDelete({ 'id' : req.params.id})
        .then(()=> {
            res.status(200).json({"msg": 'Shoppingcart deleted'});
            TopicPublisher.sendMessageWithTopic(new_product.toString(),"shoppingcart.deleted");
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});
            
module.exports = routes;