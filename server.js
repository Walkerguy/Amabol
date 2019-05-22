var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongodb = require('./src/config/mongo.db');
var environment = require('./src/config/environment');
//const app = require('./app');
//var environment = require('./config/environment');
//basic sending en recieving
//topic based messaging
var TopicHandler = require("./src/controllers/TopicHandler");
var TopicPublisher = require("./src/controllers/TopicPublisher");
var Topics = ['product.#','order.#','shoppinglist.#'] //topics to listen too


var accountroutes= require('./src/routes/Account_routes');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Account service [ONLINE].</h1>');
});


//app.get('/topic/:text/:topic', TopicPublisher.sendMessageWithTopic);

app.use('', accountroutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  TopicHandler.listen("topic_exchange",Topics);

  console.log('[Account service] listening at http://%s:%s', host, port);
});
