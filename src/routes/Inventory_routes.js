var express = require('express');
var routes = express.Router();
var mongodb = require('../config/mongo.db');
var Product = require('../models/Product');
var Event = require('../models/Event');
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
    var productid = req.params.id;

    Product.findOne({ 'id' : productid })
        .then(function (product) {
            Product.updateOne({ 'id': productid },{ $set : req.body }).then(function (updated){
                Product.findOne({ 'id' : productid })
                .then(function (newProduct){
                    res.status(200).json(newProduct);
                    var msg = { 'id': productid, 'oldValue' : product, 'newValue' : newProduct}
                    TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.updated");
                });
                
                
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
            Product.deleteOne({ 'id' : id }).then(function (newProduct){
                res.status(200).json({"msg": 'product deleted'});
                var msg = { 'id': id, 'oldValue' : product}
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
routes.post('/products/backtrack/:minutes', function (req, res) {
    subtract = new Number(req.params.minutes);
    // New date.
    var today = new Date();

    today.setMinutes(today.getMinutes() - subtract);
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    // Subtract the amount of minutes.
    var modifiedTimestamp = date + ' ' + time;

    Testdate = new Date(modifiedTimestamp);

   // We'll be adding to this array all the events that happened within the timerange.
   var eventsToRevert = [];
   modifiedtimestamp = new Date(Testdate);

   // Get and return all events.
   Event.find()
       .then(function (events) {
           for(var i =0;i < events.length; i++){
               console.log("All existing events: " + events[i].date);
               // If an event date is HIGHER than our given timestamp, it gets added to the array.

               eventdate = new Date(events[i].date);

               if((eventdate > modifiedtimestamp)){
                   console.log("REVERTABLE EVENT " + events[i]);
                   eventsToRevert.push(events[i]);
               }

               
           }

           for (var i = 0; i < eventsToRevert.length; i++)
           {
               if(eventsToRevert[i].topic == "product.created"){
                   console.log("We're in the revert CREATE now.");
                   revertCreateEvent(eventsToRevert[i]);
               }
               if(eventsToRevert[i].topic == "product.updated"){
                    console.log("We're in the revert UPDATE now.");
                   revertUpdateEvent(eventsToRevert[i]);
               }
               if(eventsToRevert[i].topic == "product.deleted"){
                   console.log("We're in the revert DELETE now.");
                   revertDeleteEvent(eventsToRevert[i]);
               }
           }
           res.status(200).json("Amount of events replayed/reverted: " + eventsToRevert.length);

       })
       .catch((error) => {
           console.log(error);
       }); 

});


function revertCreateEvent(event){
    var eventJSON = JSON.parse(event.event)
    Product.findOneAndDelete({'id': eventJSON.id})
        .then(function (response) {
            console.log("product with id: " + eventJSON.id + "deleted");
        })
        .catch((error) => {
            console.log(error);
        }); 
}

function revertUpdateEvent(event){
    var eventJSON = JSON.parse(event.event)

    console.log("ID: " + eventJSON.id);
    console.log(eventJSON);
    console.log("Oldervalue " + eventJSON.oldValue);

    Product.updateOne({ 'id': eventJSON.id}, {$set : eventJSON.oldValue})
    .then(function (response) {
        console.log(eventJSON.oldValue.name);
        console.log(eventJSON.newValue.name);


        console.log(eventJSON);
        console.log("product with id: " + eventJSON.id + "edited");
    })
    .catch((error) => {
        console.log(error);
    }); 
}

function revertDeleteEvent(event){
    var eventJSON = JSON.parse(event.event)
    Product.create( eventJSON.oldValue )
    .then(function (response) {
        console.log(response);
        console.log("product with id: " + eventJSON.id + "created");
    })
    .catch((error) => {
        console.log(error);
    }); 
}


// Rebuild database from ALL events.
routes.delete('/products/rebuilddatabase/', function (req, res) {

    // Rename current database as a backup.
    try {
        mongodb.product.rename("productbackup", function(err, collection) {});
    } 
    catch(err) 
    {
        console.log(err);
    }

    // Get all events and start rebuilding products.
    Event.find()
        .then(function (events) {
            for(var i =0;i < events.length; i++){

                // Re-create.
                if(events[i].topic == "product.created"){
                    var eventJSON = JSON.parse(event[i].event)
                    var newProduct = new Product(eventJSON);
                    newProduct.save(function(err) {
                        if (err){
                            console.log(err);
                        }
                        console.log("[REBUILD] - Product re-created.")
                    });
                }

                // Re-update.
                if(events[i].topic == "product.updated"){
                    var eventJSON = JSON.parse(event[i].event)
                    Product.find({ 'id' : eventJSON.oldValue.id })
                    .then(function (product) {
                        Product.updateOne({ id: eventJSON.newValue.id },{ $set : eventJSON.newValue }).then(function (newProduct){
                            console.log("[REBUILD] - Product re-updated.")
                        }).catch((error) => {
                            console.log(error);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }

                // Re-delete.
                if(events[i].topic == "product.deleted"){
                    var eventJSON = JSON.parse(event[i].event)
                    Product.deleteOne({ 'id' : eventJSON.id }).then(function (res){
                        console.log("[REBUILD] - Product re-deleted.")
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        })
        .catch((error) => {
            console.log(error);
        }); 



    // compare collections here.
    Product.count({}, function(err, count){
        console.log( "[REBUILD] - Amount of records: ", count );
    });

    mongodb.productbackup.count({}, function(err, count){
        console.log( "[BACKUP] - Amount of records: ", count );
    });

    res.send("Database rebuilt.");
});

function deleteAllData(){
    Product.deleteMany()
        .then(function (response) {
            console.log(response);
            console.log("all data deleted from Products")
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = routes;