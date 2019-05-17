var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Account = require('../models/Account');
var TopicPublisher = require('../controllers/TopicPublisher');
//get, post, edit, delete,

//
routes.get('/accounts', function (req, res) {
    res.contentType('application/json');
    res.status(200).json(posts);
});

routes.post('/account', function(req, res) {
    var new_account = new Account(req.body);
    TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.create");
    res.json(req.body);
});

routes.put('/account', function(req, res) {
    var new_account = new Account(req.body);
    TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.update");
    res.json(req.body);
});

routes.delete('/account', function(req, res) {
    var new_account = new Account(req.body);
    TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.delete");
    res.json(req.body);
});

module.exports = routes;
