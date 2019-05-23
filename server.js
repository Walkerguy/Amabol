var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var TopicHandler = require('./src/controllers/TopicHandler')
const mongodb = require('./config/mongo.db');

app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

var Topics = ['order.#','account.#']

var logistics = require('./routes/shippings')

const generatedId = require('uuid/v1');

app.use('/logistics', logistics);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  TopicHandler.listen("topic_exchange",Topics)

  console.log('generatedid: '+generatedId());
  console.log('Example app listening at http://%s:%s', host, port);
});