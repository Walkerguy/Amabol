var express = require('express');
var routes = express.Router();
var Account = require('../models/Account');
var TopicPublisher = require('../controllers/TopicPublisher');


//get route doet niets met topics
routes.get('/account', function (req, res, next) {
  Account.find()
  .then((account) => res.status(200).send(account))
  .catch(next);
});

//een post van een account
routes.post('/account', function(req, res ,next) {
      const accountProps = req.body;
      const generatedId = require('uuid/v1');
      accountProps.id = generatedId();
      Account.create(accountProps)
      .then((account) => {
        res.send(account)
         TopicPublisher.sendMessageWithTopic(JSON.stringify(account),"account.created");
      })
      .catch(next);
});

//een account aanpassen
routes.put('/account/:id', function(req, res) {
    var id = req.params.id;
    Account.find({ 'id' : id })
        .then(function (account) {
            console.log(account);
            var msg = { 'id': id, 'oldValue' : account, 'newValue' : req.body}
            TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"account.updated");
            Account.updateOne({ id: id },{ $set : req.body }).then(function (newAccount){
                res.status(200).json(newAccount);
            }).catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error);
        });
});

//een account deleten
routes.delete('/account/:id', function(req, res,next) {
  Account.deleteOne({id:req.params.id})
  .then((account) => {
    TopicPublisher.sendMessageWithTopic(JSON.stringify({'id' : req.params.id}),"account.deleted");
    res.status(204).send(account)
  })
  .catch(next);
});

//om in te loggen moet een account opgehaald te worden
routes.get('/account/:id', function (req, res, next) {
  Account.findById({id: id})
  .then((account) => {
    res.status(200).send(account)
    TopicPublisher.sendMessageWithTopic(JSON.stringify({'id' : req.params.id}),"account.loggedIn");
  })
  .catch(next);
});

module.exports = routes;
