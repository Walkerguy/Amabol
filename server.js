var express = require('express');
var app = express();
const cors = require('cors');
var bodyParser = require('body-parser');

var mongodb = require('./src/config/mongo.db');
var environment = require('./src/config/environment');

// All publishers.
var MessagePublisher = require("./src/messaging/publishers/MessagePublisher");
var OrderPublisher = require("./src/messaging/publishers/OrderPublisher");
var TopicPublisher = require("./src/messaging/publishers/TopicPublisher");
var Topics = ['#.inventory.#',"cool"] // Topics.

// All receivers.
var AllHandler = require("./src/messaging/receivers/_AllHandler");
var ShoppingcartHandler = require("./src/messaging/receivers/ShoppingcartHandler");
var ProductHandler = require("./src/messaging/receivers/ProductHandler");


var OrderRoutes = require('./src/routes/OrderRoutes');

app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Order management service [ONLINE].</h1>');
});

// Send out custom messages.
app.get('/publish', MessagePublisher.sendMessage);
app.get('/publish/:text', MessagePublisher.sendMessage);

app.use('/order', OrderRoutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Add message listeners here.
  //MessageHandler.listen("logs");
  //TopicHandler.listen("topic_exchange",Topics);

  console.log('[SERVER] Listening at %s:%s.', host, port);

  const uuidv1 = require('uuid/v1'); 
  console.log("[UUID] " + uuidv1());
});