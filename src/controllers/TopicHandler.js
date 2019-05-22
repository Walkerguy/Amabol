var amqp = require('amqplib/callback_api');
var Order = require('../models/Order');
var Product = require('../models/Product');
var ShoppingCart = require('../models/ShoppingCart');
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

        channel.assertQueue('acc_queue', {
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
    if(msg.fields.routingKey.contains("product.created")){createProduct(msg);}//
    if(msg.fields.routingKey.contains("product.updated")){updateProduct(msg);}//
    if(msg.fields.routingKey.contains("product.deleted")){deleteProduct(msg);}//
    if(msg.fields.routingKey.contains("order.created")){createOrder(msg);}//
    if(msg.fields.routingKey.contains("order.updated")){updateOrder(msg);}//
    if(msg.fields.routingKey.contains("order.deleted")){deleteOrder(msg);}//
    if(msg.fields.routingKey.contains("shoppinglist.created")){createShoppingcart(msg);}//
    if(msg.fields.routingKey.contains("shoppinglist.added")){addShoppingcart(msg);}//
    if(msg.fields.routingKey.contains("shoppinglist.removed")){removeShoppingcart(msg);}//
    if(msg.fields.routingKey.contains("shoppinglist.deleted")){deleteShoppingcart(msg);}//
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
  //DELETE
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

//ORDERFUNCTIONS
//CREATE
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
//UPDATE
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
//DELETE
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

//SHOPPINGLISTFUNCTIONS
//CREATE
function createShoppingcart(msg){
  console.log(" [x] creating Shoppingcart: " + msg.content.toString());
  var account = JSON.parse(msg.content.toString());
  var new_shoppingcart = new ShoppingCart({
    id: uuidv1(),
    account_id: account.id,
    Products: [],
    totalPrice: 0
  });

  new_shoppingcart.save(function(err, task) {
      if (err){
         console.log(err);
      }else{
        TopicPublisher.sendMessageWithTopic(JSON.stringify(new_shoppingcart),"shoppingcart.created");
      }
  });
}

//DELETE
function deleteShoppingcart(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;
  ShoppingCart.findOneAndDelete({ 'id' : req.params.id})
    .then(function (res) {
        res.status(200).json({"msg": 'product deleted'});
    })
    .catch((error) => {
        res.status(400).json(error);
    });
}


//LASTIGE FUNCTIES SHOPPINGLIST

function addShoppingcart(msg){
  //id is id van shoppingcart en pid van products
  var update = JSON.parse(msg.content.toString());
  var id = update.id;
  var productid = update.product_id;

    Product.find({ 'id' : productid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { id: id },
                update: { $push: { products: product.id } }
            }).then(() => {
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: product.price } }
                }).then(() => {
                    res.json(req.body);
                });
            });
        })
        .catch((error) => {
            res.status(400).json(error);
        });
}

function removeShoppingcart(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;
  var productid = update.product_id;
    Product.find({ 'id' : productid})
        .then(function (product) {
            ShoppingCart.findOneAndUpdate({
                query: { id: id },
                update: { $pull: { products: product.id } }
            }).then(()=>{
                ShoppingCart.findOneAndUpdate({
                    query: { id: id },
                    update: { $inc: { totalPrice: -product.price } }
                }).then(()=>{
                  res.json(req.body);
                });
            });
        })
        .catch((error) => {
            res.status(400).json(error);
        });
}
