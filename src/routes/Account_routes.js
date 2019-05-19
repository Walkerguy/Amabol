var express = require('express');
var routes = express.Router();
//var mongodb = require('../config/mongo.db');
var Account = require('../models/Account');
var TopicPublisher = require('../controllers/TopicPublisher');
//get, post, edit, delete,

//
routes.get('/account', function (req, res, next) {
  Account.find({})
  .then((account) => res.status(200).send(account))
  .catch(next);
});

routes.post('/account', function(req, res ,next) {
      const accountProps = req.body;
      Account.create(accountProps)
      .then((account) => {
        res.send(account)
        TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.create");
      })
      .catch(next);
});

routes.put('/account/:id', function(req, res,next) {
    const accountProps = req.body;
    Account.findByIdAndUpdate({_id:req.params.id},accountProps)
    .then(() => Account.findById({_id:req.params.id}))
    .then((account) => {
      res.send(account)
      TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.update");
    })
    .catch(next);
});

routes.delete('/account/:id', function(req, res) {
  Account.findByIdAndRemove({_id:req.params.id})
  .then((account) => {
    res.status(204).send(account)
    TopicPublisher.sendMessageWithTopic(new_account.toString(),"account.delete");
  })
  .catch(next);
});

module.exports = routes;
