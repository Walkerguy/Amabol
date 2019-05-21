var express = require('express');
var routes = express.Router();
var mongodb = require('./../config/mongo.db');
var Shipping = require('./../model/shipping.model');

routes.get('/', function (req,res,next) {
  res.contentType('application/json');
  Shipping.find({})
    .then((shipping) => {
      res.status(200).json(shipping);
    })
    .catch(next);
})

routes.post('/', function (req,res,next) {
  const shippingReq = req.body;
  Shipping.create(shippingReq)
    .then(shipping => res.send(shipping))
    .catch(next);
})

routes.get('/:id',function (req,res,next) {
  const id = req.params.id;
  Shipping.findOne({_id: id})
    .then((shipping) => {
      res.status(200).json(shipping);
    })
    .catch(next);
})

routes.put('/:id', function (req,res,next) {
  const id = req.params.id;
  const body = req.body;

  Shipping.findByIdAndUpdate({_id: id},body)
    .then(() => Movie.findByIdAndUpdate({_id: id}))
    .then(shipping => res.send(shipping))
    .catch(next);
})

routes.delete('/:id', function (req,res,next) {
  const id = req.params.id;

  Shipping.findByIdAndRemove({_id: id})
    .then(shipping => res.send(shipping))
    .catch(next);
})