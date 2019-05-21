var amqp = require('amqplib/callback_api');
var Account = require('../../models/Account');
var Product = require('../../models/Product');
var Order = require('../../models/Order');

exports.listen = function(exchange,topics) {amqp.connect('amqp://admin:Welkom1@128.199.61.247', function(error0, connection) {
    if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
    
        channel.assertExchange(exchange, 'topic', {
          durable: true
        });
    
        channel.assertQueue('shoppingcart_queue', {
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          console.log('[Shoppingcart Queue] Waiting for logs!');

          for (i=0; i<topics.length; i++) {
            channel.bindQueue(q.queue, exchange, topics[i]);
          }
    
          channel.consume(q.queue, function(msg) {
            handleMessage(msg)
            console.log("[Shoppingcart Received] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          }, {
            noAck: true
          });
        });
      });
    });
}

function handleMessage(msg){
    if(msg.fields.routingKey.includes("shoppingcart.confirmed")){
        createOrderByShoppingcart(msg);
    }
}

// Here we convert a shoppingcart to an order.
function createOrderByShoppingcart(msg){
  console.log("[Shoppingcart Created Order] creating Shoppingcart: " + msg.content.toString());
  var shoppingcart = JSON.parse(msg.content.toString());

  var newOrder = new Order;
  newOrder.buyer = shoppingcart.account_id;
  newOrder.shoppingcart = shoppingcart.products;
  newOrder.totalPrice = shoppingcart.totalPRice;
  

  newOrder.save(function(err, task) {
    if (err){
      console.log(err);
    }
    
    // A new order has been made.
    //OrderPublisher.
  });
}