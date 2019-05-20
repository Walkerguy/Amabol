var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Account = require('../models/Account');
var Order = require('../models/Order');
var Product = require('../models/Product');
var TopicPublisher = require('../messaging/TopicPublisher');

routes.post('/', function(req, res, err) {
    const newOrder = req.body;

    // Important, create a unique id here.
    const generatedId = require('uuid/v1'); 
    newOrder.Id = generatedId();

    console.log(newOrder.Id);

    Order.create(newOrder)
    .then(order => res.send(order))
    .catch((err) => {
        console.log(err);
    });
});

routes.get('/', function (req, res, next) {
    Order.find({})
        .then((orders) => res.status(200).send(orders))
        .catch(next);
});

routes.get('/:id', function (req, res, next) {
        Order.findOne({Id: req.params.id})
        .then((order) => res.status(200).send(order))
        .catch(next);
});

routes.put('/:id', function (req, res, next) {
    const orderId = req.params.id;
    const updatedOrder = req.body;

    Order.findOneAndUpdate({Id: orderId}, updatedOrder)
    .then(order => res.send(order))
    .catch(next);
});

routes.delete('/:id', function (req, res, next) {
    Order.findOneAndDelete({Id: req.params.id})
        .then((order) => res.status(200).send(order))
        .catch(next);
});

module.exports = routes;