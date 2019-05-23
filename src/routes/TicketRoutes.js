var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Account = require('../models/Account');
var Ticket = require('../models/Ticket');
var Product = require('../models/Product');
var Order = require('../models/Order');
var uuidv1 = require('uuid/v1');

var TopicPublisher = require('../messaging/publishers/TopicPublisher');

routes.get('/', function (req, res, next) {
    Ticket.find({})
        .then((tickets) => res.status(200).send(tickets))
        .catch(next);
});

routes.get('/:id', function (req, res, next) {
        Ticket.findOne({Id: req.params.id})
        .then((ticket) => res.status(200).send(ticket))
        .catch(next);
});

//POST
routes.post('/', function(req, res, err) {
    
    var new_ticket = new Ticket({
        id: uuidv1(),
        account_id: req.body.account_id,
        title: req.body.title,
        description: req.body.description,
        order: req.body.order
    });

    new_ticket.save(function(err, task) {
        if (err){
            res.send(err);
        }
        TopicPublisher.sendMessageWithTopic(JSON.stringify(new_ticket),"ticket.created");
        res.json(req.body);
    })
});

routes.put('/:id', function (req, res, next) {
         ticketId = req.params.id;
         const updatedTicket = req.body;

    Ticket.findOneAndUpdate({Id: ticketId}, updatedTicket)
    .then(ticket => res.send(ticket))
    
    .catch(next);
});

routes.delete('/:id', function (req, res, next) {
    Ticket.findOneAndDelete({Id: req.params.id})
        .then((ticket) => res.status(200).send(ticket))
        .catch(next);
});

module.exports = routes;