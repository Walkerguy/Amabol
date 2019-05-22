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
    if(msg.fields.routingKey.includes("account.create")){
      createAccount(msg);
    }
    if(msg.fields.routingKey.includes("account.updated")){
      updateAccount(msg);
    }
    if(msg.fields.routingKey.includes("account.deleted")){
        updateAccount(msg);
      }
      if(msg.fields.routingKey.includes("order.create")){
        createAccount(msg);
      }
      if(msg.fields.routingKey.includes("order.updated")){
        updateAccount(msg);
      }
      if(msg.fields.routingKey.includes("order.deleted")){
          updateAccount(msg);
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
        console.log(err);
    }
  });
}

function updateAccount(msg){
  var update = JSON.parse(msg.content.toString());
  var id = update.id;

  Account.updateOne({ id: id }, { 
    name : update.newValue.name,
    address : update.newValue.address
  } );
}

function createTicket(msg){
  console.log(" [x] creating Ticket: " + msg.content.toString());
  var account = JSON.parse(msg.content.toString());
  var new_ticket = new ticket({
    id: uuidv1(),
    account_id: account.id,
    Products: [],
    totalPrice: 0 
  });

  new_ticket.save(function(err, task) {
      if (err){
         console.log(err);
      }else{
        TopicPublisher.sendMessageWithTopic(JSON.stringify(new_ticket),"ticket.created");
      }
  });
}

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