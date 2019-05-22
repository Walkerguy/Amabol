var amqp = require('amqplib/callback_api');
var mongodb = require('../../config/mongo.db');
var Event = require('./../../model/event.model');
var ProductHandler = require('./ProductHandler');
var AccountHandler = require('./AccountHandler');
var ShoppingcartHandler = require('./ShoppingcartHandler');

exports.listen = function(exchange,topics) {amqp.connect('amqp://admin:Welkom1@128.199.61.247', function(error0, connection) {
  if (error0) {
    console.log('error '+error0);
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      console.log('error '+error1);
      throw error1;
    }

    channel.assertExchange(exchange, 'topic', {
      durable: true
    });

    channel.assertQueue('denormalizer_account_queue', {
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      topics.forEach(function(key) {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, function(msg) {
        handleMessage(msg);
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });

  });
});
}

function handleMessage(msg){
  //Products
  if(msg.routingKey.toString().contains("product.created")){
    ProductHandler.createProduct(msg);
  }
  if(msg.routingKey.toString().contains("product.updated")){
    ProductHandler.updateProduct(msg);
  }
  if(msg.routingKey.toString().contains("product.deleted")){
    ProductHandler.deleteProduct(msg);
  }

  //Account
  if(msg.routingKey.toString().contains("account.created")){
    AccountHandler.createAccount(msg);
  }
  if(msg.routingKey.toString().contains("account.updated")){
    AccountHandler.updateAccount(msg);
  }
  if(msg.routingKey.toString().contains("account.deleted")){
    AccountHandler.deleteAccount(msg);
  }

  //Order
  if(msg.routingKey.toString().contains("order.created")){
    
  }
  if(msg.routingKey.toString().contains("order.updated")){
    
  }
  if(msg.routingKey.toString().contains("order.deleted")){
    
  }

  //Shoppingcart
  if(msg.routingKey.toString().contains("shoppingcart.created")){
    ShoppingcartHandler.createShoppingcart(msg);
  }
  if(msg.routingKey.toString().contains("shoppingcart.added")){
    ShoppingcartHandler.addToShoppingcart(msg);
  }
  if(msg.routingKey.toString().contains("shoppingcart.removed")){
    ShoppingcartHandler.removeFromShoppingcart(msg);
  }
  if(msg.routingKey.toString().contains("shoppingcart.deleted")){
    ShoppingcartHandler.deleteShoppingcart(msg);
  }

}