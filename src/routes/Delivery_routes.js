var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var Delivery = require('../models/Delivery');
var TopicPublisher = require('../controllers/TopicPublisher');
var uuidv1 = require('uuid/v1'); 



routes.get('/deliverys', function (req, res) {
    res.contentType('application/json');

    res.status(200).json(deliverys);

    Delivery.find()
        .then(function (delivery) {
            res.status(200).json(delivery);
            console.log(delivery);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/deliverys/:id', function (req, res) {
    Delivery.find({ '_id' : ObjectId(req.params.id)})
        .then(function (delivery) {
            res.status(200).json(delivery);
            console.log(delivery);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/deliverys', function(req, res) {
    var new_delivery = new Delivery({
        id: uuidv1(),
        reciever: req.body.reciever,
        address: req.body.address,
        products: req.body.products
    });

    new_delivery.save(function(err, task) {
      if (err){
        res.send(err);
      }
        TopicPublisher.sendMessageWithTopic(new_delivery.toString(),"shipment.create");
        res.json(task);
    });
});

routes.update('/deliverys/:id/changeAmount', function(req, res) {
    var id = req.params.id;
    var oldAmount;
    
    Product.find({ '_id' : ObjectId(req.params.id)})
        .then(function (product) {
            res.status(200).json(product);
            oldAmount = product.amount;
            Product.findOneAndUpdate({
                query: { _id: ObjectId(id) },
                update: { $set: { amount: req.body.amount } }
            });
        
            var msg = { 'oldAmount' : oldAmount, 'newAmount' : req.body.amount}
            TopicPublisher.sendMessageWithTopic(msg,"shipment.update");
            
            res.json(req.body);

            console.log(product);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
        
});

routes.delete('/deliverys/:id', function (req, res) {
    Product.findOneAndDelete({ 'id' : ObjectId(req.params.id)})
        .then(function (res) {
            res.status(200).json({"msg": 'product deleted'});
            TopicPublisher.sendMessageWithTopic(req.params.id,"shipment.delete");
        })
        .catch((error) => {
            res.status(400).json(error);
        });

    

});

module.exports = routes;