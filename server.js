var express = require('express');
var app = express();
var sendController = require("./src/send");
var receiveController = require("./src/receive");

app.get('/', function (req, res) {
  res.send('<h1>Hello World from Nodejs!</h1>');
});

app.get('/send', sendController.sendMessage);
app.get('/send/:text', sendController.sendMessage);


var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  receiveController.listen

  console.log('Example app listening at http://%s:%s', host, port);
});