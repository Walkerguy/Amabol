var express = require('express');
var routes = express.Router();
var Order = require('../models/Order');
var OrderPublisher = require('../messaging/publishers/OrderPublisher');

routes.post('/', function(req, res) {
    const newOrder = req.body;
    
    // Important, create a unique id here.
    const generatedId = require('uuid/v1'); 
    newOrder.id = generatedId();

    Order.create(newOrder, function(req, madeOrder) 
    {
        OrderPublisher.sendMessageWithTopic(JSON.stringify({madeOrder}), "order.created");
        res.json(madeOrder);
    })
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

    Order.updateOne({id: orderId}, {updatedOrder}).then (function(madeOrder) 
    {
        Order.findOne({id: orderId}).then (function(updatedOrder) 
        {
            OrderPublisher.sendMessageWithTopic(JSON.stringify({updatedOrder}), "order.updated");
            res.json(updatedOrder);
        }).catch((error) => {
            console.log(error);
        });
        
    }).catch((error) => {
        console.log(error);
    });
})

routes.delete('/:id', function (req, res, next) {
    Order.deleteOne({id: req.params.id}, function(req, madeOrder) 
    {
        OrderPublisher.sendMessageWithTopic(JSON.stringify({madeOrder}), "order.deleted");
        res.json(madeOrder);
    })
});

// Why doesn't this work...
routes.delete('/deleteall', function (req, res, next) {
    Order.deleteMany({})
        .then((order) => res.send(order))
        .catch(next);
});

// Order finalized, becomes a delivery now.
routes.put('/:id/confirmed', function (req, res, next) {
    var orderid = req.params.id;

    Order.updateOne({id: orderid}, { status: "Confirmed."}).then (function(madeOrder) 
    {
        Order.findOne({id: orderid}).then (function(confirmedOrder) 
        {
            OrderPublisher.sendMessageWithTopic(JSON.stringify({confirmedOrder}), "order.confirmed");
            res.json(confirmedOrder);
        }).catch((error) => {
            console.log(error);
        });
        
    }).catch((error) => {
        console.log(error);
    });
});

module.exports = routes;