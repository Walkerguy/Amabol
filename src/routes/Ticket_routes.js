var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');
var uuidv1 = require('uuid/v1'); 



routes.get('/tickets', function (req, res) {
    res.contentType('application/json');

    res.status(200).json(tickets);

    Ticket.find()
        .then(function (ticket) {
            res.status(200).json(ticket);
            console.log(ticket);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.get('/tickets/:id', function (req, res) {
    Ticket.find({ '_id' : ObjectId(req.params.id)})
        .then(function (ticket) {
            res.status(200).json(ticket);
            console.log(ticket);
        })
        .catch((error) => {
            res.status(400).json(error);
        });
});

routes.post('/tickets', function(req, res) {
    var new_ticket = new Ticket({
        id: uuidv1(),
        account: {
            id: String,
            name: String
        }.req.body.receiver,      //Account name and ID 
        title: req.body.address,
        description: req.body.description
    });

    new_ticket.save(function(err, task) {
      if (err){
        res.send(err);
      }
        TopicPublisher.sendMessageWithTopic(new_ticket.toString(),"ticket.create");
        res.json(task);
    });
});

// routes.update('/deliverys/:id/changeAmount', function(req, res) {
//     var id = req.params.id;
//     var oldAmount;
    
//     Product.find({ '_id' : ObjectId(req.params.id)})
//         .then(function (product) {
//             res.status(200).json(product);
//             oldAmount = product.amount;
//             Product.findOneAndUpdate({
//                 query: { _id: ObjectId(id) },
//                 update: { $set: { amount: req.body.amount } }
//             });
        
//             var msg = { 'oldAmount' : oldAmount, 'newAmount' : req.body.amount}
//             TopicPublisher.sendMessageWithTopic(msg,"shipment.update");
            
//             res.json(req.body);

//             console.log(product);
//         })
//         .catch((error) => {
//             res.status(400).json(error);
//         });
        
// });
// Updaten van description van tickets, wanneer deze bijvoorbeeld verder zijn opgelost of de beschrijving van een probleem niet geheel juist is genoteerd

routes.delete('/tickets/:id', function (req, res) {
    Ticket.findOneAndDelete({ 'id' : ObjectId(req.params.id)})
        .then(function (res) {
            res.status(200).json({"msg": 'product deleted'});
            TopicPublisher.sendMessageWithTopic(req.params.id,"shipment.delete");
        })
        .catch((error) => {
            res.status(400).json(error);
        });

    
});

module.exports = routes;