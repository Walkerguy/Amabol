var express = require('express');
var routes = express.Router();
var Order = require('../models/Order');
var OrderPublisher = require('../messaging/publishers/OrderPublisher');

routes.post('/', function(req, res, err) {
    const newOrder = req.body;

    // Important, create a unique id here.
    const generatedId = require('uuid/v1'); 
    newOrder.id = generatedId();

    Order.create(newOrder)
        .then(order => {
            OrderPublisher.sendMessageWithTopic(JSON.stringify(order), 'order.created')}),
            res.send(order)
        .catch((err) => {
            console.log(err);
    });
});

routes.get('/', function (req, res, next) {
    Order.find()
        .then((orders) => res.send(orders))
        .catch(next);
});

routes.get('/:id', function (req, res, next) {
    Order.findOne({id: req.params.id})
        .then((order) => res.send(order))
        .catch(next);
});

routes.put('/:id', function (req, res, next) {
    const orderId = req.params.id;
    const updatedOrder = req.body;

    Order.updateOne({id: orderId}, updatedOrder)
        .then(order => res.send(order)).then(console.log("[RABBITMQ] Put a UPDATED event here."))
        .catch(next);
});

routes.delete('/:id', function (req, res, next) {
    Order.deleteOne({id: req.params.id})
        .then((order) => res.send(order)).then(console.log("[RABBITMQ] Put a DELETED event here."))
        .catch(next);
});

routes.delete('/deleteall', function (req, res, next) {
    Order.deleteMany({})
        .then((order) => res.send(order))
        .catch(next);
});

// Order finalized.
routes.put('/confirmed', function (req, res, next) {
    Order.updateOne({id: req.body.id}, { status: "Confirmed."})
        .then(order => res.send(order)).then(console.log("[RABBITMQ] Put a CONFIRMED event here."))
        .catch(next);
});

module.exports = routes;