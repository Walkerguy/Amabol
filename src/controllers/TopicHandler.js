var amqp = require('amqplib/callback_api');

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
          durable: false
        });

        channel.assertQueue('account_queue', {
          exclusive: true
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
    if(msg.fields.routingKey.contains("product.created")){createProduct(msg);}
    if(msg.fields.routingKey.contains("product.updated")){updateProduct(msg);}
    if(msg.fields.routingKey.contains("product.deleted")){deleteProduct(msg);}
    if(msg.fields.routingKey.contains("order.created")){createOrder(msg);}
    if(msg.fields.routingKey.contains("order.updated")){updateOrder(msg);}
    if(msg.fields.routingKey.contains("order.deleted")){deleteOrder(msg);}
    if(msg.fields.routingKey.contains("shoppinglist.created")){createShoppinglist(msg);}
    if(msg.fields.routingKey.contains("shoppinglist.added")){addShoppinglist(msg);}
    if(msg.fields.routingKey.contains("shoppinglist.removed")){removeShoppinglist(msg);}
    if(msg.fields.routingKey.contains("shoppinglist.deleted")){deleteShoppinglist(msg);}
}
//PRODUCTFUNCTIONS
//CREATE
function createProduct(msg){
  console.log(" [x] creating Product: " + msg.content.toString());
  var product = JSON.parse(msg.content.toString());
  var new_product = new Product({
    id: product.id,
    name: product.name,
    description: product.description,
    amount: product.amount,
    price: product.price
  });
  new_product.save(function(err, task) {
    if (err){
      console.log(err);
    }
  });
}
//UPDATE
function updateProduct(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;
    Product.updateOne({ id: id },{ $set :
      {
        amount : update.newValue.amount,
        name: update.newValue.name,
        description : update.newValue.description,
        price: update.newValue.price
      } }).then(function (newProduct){
        console.log(newProduct);
    }).catch((error) => {
        console.log(error);
    });
  }

//ORDERFUNCTIONS
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
    });
  }

//SHOPPINGLISTFUNCTIONS
