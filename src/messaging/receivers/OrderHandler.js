var amqp            = require('amqplib/callback_api');
var Account         = require('../../models/Account');
var Order           = require('../../models/Order');
var Product         = require('../../models/Product');
var Shoppingcart    = require('../../models/Shoppingcart');

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
            console.log("[OrderHandler - Event Received] %s:'%s'", msg.fields.routingKey, msg.content.toString());
            handleMessage(msg)
          }, {
            noAck: true
          });
        });
      });
    });
}

function handleMessage(msg){
  // Creates an order from a shoppingcart.
  if(msg.fields.routingKey.includes("shoppingcart.confirmed")){
    createShoppingcart(msg);
    createOrder(msg);
  }

  // Updates order status if logistics sends it.
  if(msg.fields.routingKey.includes("delivery.confirmed")){
    deliveryConfirmed(msg);
  }

  // Account CRUD.
  if(msg.fields.routingKey.includes("account.created")){
    createAccount(msg);
  }
  if(msg.fields.routingKey.includes("account.created")){
    updateAccount(msg);
  }
  if(msg.fields.routingKey.includes("account.created")){
    deleteAccount(msg);
  }

  // Product CRUD.
  if(msg.fields.routingKey.includes("product.created")){
    createProduct(msg);
  }
  if(msg.fields.routingKey.includes("product.created")){
    updateProduct(msg);
  }
  if(msg.fields.routingKey.includes("product.created")){
    deleteProduct(msg);
  }
}

// Make a shoppingcart.
function createShoppingcart(msg){
  console.log("[Shoppingcart Created] creating shoppingcart: " + msg.content.toString());
  var cart = JSON.parse(msg.content.toString());

  var newShoppingcart = new Shoppingcart({
    id: cart.id,
    account_id: car.account_id,
    productIds: cart.productIds,
    totalPrice: cart.totalPrice
  });

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

  var newOrder = new Order({
    buyer: newShoppingcart.id,
    shoppingcart: newShoppingcart.name,
    totalPrice: newShoppingcart.address
  });
  
  // Make the new order, and notify the rest.
  Order.create(newOrder)
    .then(order => res.send(order)).then(OrderPublisher.sendMessageWithTopic(JSON.stringify(newOrder), 'order.created'))
    .catch((err) => {
        console.log(err);
    });
}

function deliveryConfirmed(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;

  Order.updateOne({ id: id }, { status: "Delivery sent."}).then(function (newAccount){
    res.status(200).json(updatedOrder).then(OrderPublisher.sendMessageWithTopic(JSON.stringify(updatedOrder), 'order.updated'));
    }).catch((error) => {
    console.log(error);
  });;
}

// All account functions.
function createAccount(msg){
  console.log("[Order Service] creating Account: " + msg.content.toString());
  var account = JSON.parse(msg.content.toString());

  var newAccount = new Account({
    id: account.id,
    name: account.name,
    address: account.address,
    postalcode: account.postalcode,
    city: account.city,
    email: account.email,
    phone: account.phone,
    type: account.type,
  });

  newAccount.save(function(err, task) {
    if (err){
        console.log(err);
    }
  });
}

function updateAccount(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;

  Account.updateOne({ id: id }, update);
}

function deleteAccount(msg){
  var remove = JSON.parse(msg.content.toString());
  var id = remove.id;

  Account.deleteOne({ id: id }, { 
    if (err){
      console.log(err);
    }
  });
}

// All product functions.
function createProduct(msg){
  console.log("[Order Service] creating Product: " + msg.content.toString());
  var product = JSON.parse(msg.content.toString());

  var newProduct = new Product({
    id: product.id,
    name: product.name,
    description: product.description,
    amount: product.amount,
    price: product.price
  });

  newProduct.save(function(err, task) {
    if (err){
        console.log(err);
    }
  });
}

function updateProduct(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;

  Product.updateOne({ id: id }, update);
}