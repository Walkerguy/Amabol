var express = require('express');
var app = express();

//basic sending en recieving 
var sendController = require("./src/controllers/send");
var receiveController = require("./src/controllers/receive");
//publishing and subscribing
var MessageHandler = require("./src/controllers/MessageHandler");
var MessagePublisher = require("./src/controllers/MessagePublisher");
//topic based messaging
var TopicHandler = require("./src/controllers/TopicHandler");
var TopicPublisher = require("./src/controllers/TopicPublisher");
var Topics = ['hello'] //topics to listen too

app.get('/', function (req, res) {
  res.send('<h1>Hello World from Nodejs!</h1>');
});

app.get('/send', sendController.sendMessage);
app.get('/send/:text', sendController.sendMessage);

app.get('/publish', MessagePublisher.sendMessage);
app.get('/publish/:text', MessagePublisher.sendMessage);

app.get('/topic/:text/:topic', TopicPublisher.sendMessageWithTopic);


var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  receiveController.listen("hello");
  MessageHandler.listen("logs");
  TopicHandler.listen("topic_logs",Topics)

  console.log('Example app listening at http://%s:%s', host, port);
});