var amqp = require('amqplib/callback_api');
var Product = require('../models/Product');
var TopicPublisher = require('../controllers/TopicPublisher');

exports.listen = function(exchange,topics) {amqp.connect('amqp://admin:Welkom1@128.199.61.247', function(error0, connection) {
    if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        //var exchange = 'topic_logs';
    
        channel.assertExchange(exchange, 'topic', {
          durable: true
        });
    
        channel.assertQueue('inventory_queue', {
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(' [*] Waiting for logs. To exit press CTRL+C');

          for (i=0; i<topics.length; i++) {
            channel.bindQueue(q.queue, exchange, topics[i]);
          }
    
          channel.consume(q.queue, function(msg) {
            handleMessage(msg)
            console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          }, {
            noAck: true
          });
        });
      });
    });
}

function handleMessage(msg){
    if(msg.fields.routingKey.includes("order.confirmed")){
        updateProducts(msg);
    }
}

function updateProducts(msg){
  console.log(" [x] Recieved topic" + msg.fields.routingKey + ": %s", msg.content.toString());
  var order = JSON.parse(msg);
  order.productIds.array.forEach(productId => {
    Product.find({"id": productId}).then(function (product){

      oldAmount = product.amount;
      var msg = { 'id': productId, 'oldValue' : JSON.stringify(product), 'newValue' : {"amount" : oldAmount -1}}
      TopicPublisher.sendMessageWithTopic(JSON.stringify(msg),"product.updated");
    })
    .catch((error) => {
        res.status(400).json(error);
    });

    Product.findOneAndUpdate({
      query: { id: productId },
      update: { $inc: { amount: -1 } }
    });
  });
}
