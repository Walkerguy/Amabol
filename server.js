var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongodb = require('./src/config/mongo.db');
var environment = require('./src/config/environment');
//const app = require('./app');
//var environment = require('./config/environment');
//basic sending en recieving
var sendController = require("./src/controllers/send");
var receiveController = require("./src/controllers/receive");
//publishing and subscribing
var MessageHandler = require("./src/controllers/MessageHandler");
var MessagePublisher = require("./src/controllers/MessagePublisher");
//topic based messaging
var TopicHandler = require("./src/controllers/TopicHandler");
var TopicPublisher = require("./src/controllers/TopicPublisher");
var Topics = ['#.account.#','#.order.#'] //topics to listen too


var accountroutes= require('./src/routes/Account_routes');

app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json


app.get('/', function (req, res) {
  res.send('<h1>Hello World from Nodejs!</h1>');
});

app.get('/send', sendController.sendMessage);
app.get('/send/:text', sendController.sendMessage);

app.get('/publish', MessagePublisher.sendMessage);
app.get('/publish/:text', MessagePublisher.sendMessage);

//app.get('/topic/:text/:topic', TopicPublisher.sendMessageWithTopic);

app.use('', accountroutes);

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  receiveController.listen("hello");
  MessageHandler.listen("logs");
  TopicHandler.listen("topic_logs",Topics);

  console.log('Example app listening at http://%s:%s', host, port);
});
