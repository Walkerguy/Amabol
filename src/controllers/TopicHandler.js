var amqp = require('amqplib/callback_api');
var Account = require('../models/Account');
var Product = require('../models/Product');
var uuidv1 = require('uuid/v1');

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
    if(msg.fields.routingKey.includes("account.create")){
        createAccount(msg);
        createShoppingcart(msg);
    }
    if(msg.fields.routingKey.includes("product.created")){
        createProduct(msg);
    }
}

function createAccount(msg){
  console.log(" [x] creating Account: " + msg.content.toString());
  var account = JSON.parse(msg.content.toString());

  var new_account = new Account({
    id: account.id,
    name: account.name,
    address: account.address
  });

  new_account.save(function(err, task) {
    if (err){
        res.send(err);
    }
    //TopicPublisher.sendMessageWithTopic(new_shoppingcart.toString(),"shoppingcart.create");
    res.json(task);
  });
}

function createShoppingcart(msg){
  console.log(" [x] creating Shoppingcart: " + msg.content.toString());
}

function createProduct(msg){
  console.log(" [x] creating Product: " + msg.content.toString());
  var product = JSON.parse(msg.content.toString());

  var new_product = new Product({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price
  });

  new_product.save(function(err, task) {
    if (err){
      console.log(err);
    }
  });
}
