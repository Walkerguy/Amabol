var express = require('express');
var app = express();

var events = require('./routes/event.route');

var receiveController = require('./src/controllers/AllMessagesHandler');
var Topics = ['product.#','shoppingcart.#','account.#','order.#']

var bodyParser = require('body-parser');
var TopicHandler = require("./src/controllers/TopicHandler");

const mongodb = require('./config/mongo.db');

app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  TopicHandler.listen('topic_exchange',Topics);

  console.log('Example app listening at http://%s:%s', host, port);
});