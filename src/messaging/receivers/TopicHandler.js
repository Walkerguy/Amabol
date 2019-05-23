var amqp = require('amqplib/callback_api');
var Product = require('../../models/Product');
var Account = require('../../models/Account')
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
    
        channel.assertQueue('helpdesk_queue', {
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
     if(msg.fields.routingKey.includes("Product.create")){ createProduct(msg);}
     if(msg.fields.routingKey.includes("Product.updated")){ updateProduct(msg);}
     if(msg.fields.routingKey.includes("Product.deleted")){ deleteProduct(msg);}
     if(msg.fields.routingKey.includes("account.create")){ createAccount(msg);}
     if(msg.fields.routingKey.includes("account.updated")){ updateAccount(msg);}
     if(msg.fields.routingKey.includes("account.deleted")){ deleteAccount(msg);}
     if(msg.fields.routingKey.includes("order.create")){ createOrder(msg);}
     if(msg.fields.routingKey.includes("order.updclated")){ updateOrder(msg);}
     if(msg.fields.routingKey.includes("order.deleted")){ deleteOrder(msg);}
}

//PRODUCT FUNCTIONS
//CREATE PRODUCT
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
//UPDATE PRODUCT
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
//DELETE PRODUCT
function deleteProduct(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;
  Product.findOneAndDelete({ 'id' : req.params.id})
    .then(function (res) {
        res.status(200).json({"msg": 'product deleted'});
    })
    .catch((error) => {
        res.status(400).json(error);
    });
}
//ACCOUNT FUNCTIONS
//CREATE ACCOUNT
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

//UPDATE ACCOUNT
function updateAccount(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;
  Account.updateOne({ id: id },{ $set :
    {
      id: update.id,
      name: update.name,
      address: update.address,
      postalcode: update.postalcode,
      city: update.city,
      email: update.email,
      phone: update.phone,
      type: update.type,
    } }).then(function (newAccount){
      console.log(newAccount);
  }).catch((error) => {
      console.log(error);
  });
}
//DELETE ACCOUNT
function deleteAccount(msg){
  Account.findOneAndDelete({ 'id' : req.params.id})
    .then(function (res) {
        res.status(200).json({"msg": 'account deleted'});
    })
    .catch((error) => {
        res.status(400).json(error);
    });
}

//ORDER FUNCTIONS
//CREATE ORDER
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
//UPDATE ORDER
function updateOrder(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;
    Order.updateOne({ id: id },{ $set :
      {
        buyer : update.newValue.amount,
        status: update.newValue.name,
        productsIds : update.newValue.description
      } }).then(function (newOrder){
        console.log(newOrder);
    }).catch((error) => {
        console.log(error);
    });
  }
//DELETE ORDER
  function deleteOrder(msg){
    var update = JSON.parse(msg.content.toString());
    var id = update.id;
    Order.findOneAndDelete({ 'id' : req.params.id})
      .then(function (res) {
          res.status(200).json({"msg": 'Order deleted'});
      })
      .catch((error) => {
          res.status(400).json(error);
      });
  }

//CREATE ORDER
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