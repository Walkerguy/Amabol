var express         = require('express');
var app             = express();
var cors            = require('cors');
var bodyParser      = require('body-parser');

var mongodb         = require('./src/config/mongo.db');
var environment     = require('./src/config/environment');

// Messaging.
var Topics          = ['product.#','shoppingcart.#', 'account.#', 'delivery.#'] // Topics.
var OrderHandler    = require("./src/messaging/receivers/OrderHandler");

var OrderRoutes     = require('./src/routes/OrderRoutes');
var TestingRoutes   = require('./src/routes/TestingRoutes');

app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('<h1>Order management service [ONLINE].</h1>');
});

// Send out custom messages.
app.use('/', TestingRoutes);
app.use('/order', OrderRoutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  // Add message listeners here.
  OrderHandler.listen("topic_exchange", Topics);

  console.log('[SERVER] Listening at %s:%s.', host, port);
});