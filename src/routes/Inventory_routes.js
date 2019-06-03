var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../messaging/TopicPublisher');
var uuidv1 = require('uuid/v1');

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
            console.log(err);
            res.send(err);
        }
        TopicPublisher.sendMessageWithTopic(JSON.stringify(new_product),"product.created");
        res.status(200).json(new_product);
    });
});

// Update.
routes.put('/products/:id', function(req, res) {
    var id = req.params.id;

    Product.find({ 'id' : id })
        .then(function (product) {
            Product.updateOne({ id: id },{ $set : req.body }).then(function (newProduct){
                res.status(200).json(newProduct);
                var msg = { 'id': id, 'oldValue' : product, 'newValue' : newProduct}
                TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.updated");
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
});

// Delete.
routes.delete('/products/:id', function (req, res) {
    var id = req.params.id;

    Product.find({ 'id' : id })
        .then(function (product) {
            Product.deleteOne({ 'id' : id }).then(function (res){
                res.status(200).json({"msg": 'product deleted'});
                var msg = { 'id': id, 'oldValue' : product, 'newValue' : res}
                TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.deleted");
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
});


// Trackback, give a timestamp and this will do the opposite of all the event up until that time.
// routes.update('/products/backtrackevents/', function (req, res) {
//     // Timestamp from body; HH (hours to track back on)
//     Date 

//     Product.find({ 'id' : id })
//         .then(function (product) {
//             Product.deleteOne({ 'id' : id }).then(function (res){
//                 res.status(200).json({"msg": 'product deleted'});
//                 var msg = { 'id': id, 'oldValue' : product, 'newValue' : res}
//                 TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.deleted");
//             }).catch((error) => {
//                 console.log(error);
//             });
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// });







// Trackback, delete the database and rebuild up until now.
// First; we rename the current collection to something else like productold
// Then we refill the product collection by going through the event history
// Then we compare the two collections (do they have the same amount of records?)
// Then we delete productold.
// var passphrase = uuidv1();
// routes.delete('/products/rebuilddatabase/:passphrase', function (req, res) {

//     // Use a passphrase check to make sure a database wipe is alright.
//     if (req.params.passphrase == passphrase)
//     {
//         //LETS DELETE SOME STUFF HERE
//         Product.deleteMany({}).then(function)
//     }

//     else{
//         res.send("Are you sure you want to rebuild the inventory service's database? Add this to the URL if you're sure " + passphrase)
//     }
// });

module.exports = routes;