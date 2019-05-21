var amqp = require('amqplib/callback_api');
var Account = require('../../models/Account');
var Product = require('../../models/Product');
var Order = require('../../models/Order');
var OrderPublisher = require('../publishers/OrderPublisher');

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
    
        channel.assertQueue('order_queue', {
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }

          console.log('[Order Queue] Waiting for logs!');

          for (i=0; i<topics.length; i++) {
            channel.bindQueue(q.queue, exchange, topics[i]);
          }
    
          channel.consume(q.queue, function(msg) {
            console.log("[OrderHandler Received] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            handleMessage(msg)
          }, {
            noAck: true
          });
        });
      });
    });
}

function handleMessage(msg){
    if(msg.fields.routingKey.includes("shoppingcart.confirmed")){
        createShoppingcart(msg);
        createOrder(msg);
    }
}

// Make a shoppingcart.
function createShoppingcart(msg){
  console.log("[Shoppingcart Created] creating shoppingcart: " + msg.content.toString());
  var newShoppingcart = new Shoppingcart(JSON.parse(msg.content.toString()));

  newShoppingcart.save(function(err, task) {
    if (err){
      console.log(err);
    }
  });
  

  newOrder.save(function(err, task) {
    if (err){
      console.log(err);
    }
  });
}

// Make a new order based on the shoppingcart.
function createOrder(msg){
  console.log("[Order Created] creating order: " + msg.content.toString());
  var newShoppingcart = new Shoppingcart(JSON.parse(msg.content.toString()));

  var newOrder = new Order;
  newOrder.buyer = newShoppingcart.account_id;
  newOrder.shoppingcart = newShoppingcart.products;
  newOrder.totalPrice = newShoppingcart.totalPRice;
  

  newOrder.save(function(err, task) {
    if (err){
      console.log(err);
    }
    
    // A new order has been made.
    //OrderPublisher.
  });
}