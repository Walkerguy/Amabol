var express = require('express');
var routes = express.Router();
var mongodb = require('./../config/mongo.db');
var Shipping = require('./../model/shipping.model');

const generatedId = require('uuid/v1');

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

  var shipment = {
    id: generatedId(),
    deliveryAddress: shippingReq.deliveryAddress,
    status: shippingReq.status,
    products: shippingReq.products,
  }

  Shipping.create(shipment)
    .then(shipping => res.send(shipping))
    .catch(next);
})

routes.get('/:id',function (req,res,next) {
  const id = req.params.id;
  Shipping.findOne({id: id})
    .then((shipping) => {
      res.status(200).json(shipping);
    })
    .catch(next);
})

routes.put('/:id', function (req,res,next) {
  const id = req.params.id;
  const shippingReq = req.body;

  var shipment = {
    id: generatedId(),
    deliveryAddress: shippingReq.deliveryAddress,
    status: shippingReq.status,
    products: shippingReq.products,
  }

  Shipping.findByIdAndUpdate({id: id},shipment)
    .then(() => Shipping.findByIdAndUpdate({id: id}))
    .then(shipping => res.send(shipping))
    .catch(next);
})

routes.delete('/:id', function (req,res,next) {
  const id = req.params.id;

  Shipping.findByIdAndRemove({id: id})
    .then(shipping => res.send(shipping))
    .catch(next);
})

module.exports = routes;