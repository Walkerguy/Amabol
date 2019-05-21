var express = require('express')
var routes = express.Router();
var mongodb = require('./../config/mongo.db');
var Event = require('./../model/event.model');

routes.get('/getall', function (req,res,next) {
  res.contentType('application/json');
  Event.find({})
    .then((events) => {
      res.status(200).json(events);
    })
    .catch(next);
})

module.exports = routes;