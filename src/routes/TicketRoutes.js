var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Account = require('../models/Account');
var Ticket = require('../models/Ticket');
var TopicPublisher = require('../messaging/publishers/TopicPublisher');

routes.post('/', function(req, res, err) {
    const newTicket = req.body;

    // Important, create a unique id here.
    const generatedId = require('uuid/v1'); 
    newTicket.Id = generatedId();

    console.log(newTicket.Id);

    Ticket.create(newTicket)
    .then(ticket => res.send(ticket))
    .catch((err) => {
        console.log(err);
    });
});

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

routes.put('/:id', function (req, res, next) {
    const ticketId = req.params.id;
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