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
    //newOrder.id = require('uuid/v1');

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
        Order.findOne({id: req.params.id})
        .then((order) => res.status(200).send(order))
        .catch(next);
});

routes.put('/', function (req, res, next) {
    const orderId = req.params.id;
    const updatedOrder = req.body;

    Order.findOneAndUpdate({id: orderId}, updatedOrder)
    .then(() => Order.findById({_id:orderId}))
    .then(order => res.send(order))
    .catch(next);
});

routes.delete('/', function (req, res, next) {
    Order.findOneAndDelete({id: req.params.id})
        .then((order) => res.status(200).send(order))
        .catch(next);
});

module.exports = routes;