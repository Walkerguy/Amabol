var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('./src/config/mongo.db');
var environment = require('./src/config/environment');

// All publishers.
// var MessagePublisher = require("./src/messaging/publishers/MessagePublisher");
// var OrderPublisher = require("./src/messaging/publishers/OrderPublisher");
// var TopicPublisher = require("./src/messaging/publishers/TopicPublisher");
var Topics = ['account.#','product.#','order.#'] // Topics.

var TopicHandler = require("./src/messaging/receivers/TopicHandler");

var TicketRoutes = require('./src/routes/TicketRoutes');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Ticket management service [ONLINE].</h1>');
});

// Send out custom messages.
// app.get('/publish', Mes  sagePublisher.sendMessage);
// app.get('/publish/:text', MessagePublisher.sendMessage);

app.use('/ticket', TicketRoutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Add message listeners here.
  TopicHandler.listen("topic_exchange",Topics);

  console.log('[SERVER] Listening at %s:%s.', host, port);

  const uuidv1 = require('uuid/v1'); 
  console.log("[UUID] " + uuidv1());
});