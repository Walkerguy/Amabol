var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');

var mongodb         = require('./src/config/mongo.db');
var environment     = require('./src/config/env/env');

// Messaging.
// Messaging.
var ProductHandler = require("./src/messaging/ProductHandler");
var TopicHandler = require("./src/messaging/TopicHandler");
var Topics1 = ['order.#'];
var Topics2 = ['product.#'];

var inventoryroutes= require('./src/routes/Inventory_routes');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Inventory management service [ONLINE].</h1>');
});

// Send out custom messages.
app.use('/', inventoryroutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Add message listeners here.
  TopicHandler.listen("topic_exchange", Topics1);
  ProductHandler.listen("topic_exchange", Topics2);

  console.log('[SERVER] Listening at %s:%s.', host, port);
});