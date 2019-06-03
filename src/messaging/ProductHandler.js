var amqp = require('amqplib/callback_api');
var mongodb = require('./../config/mongo.db');
var Event = require('../models/Event');

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

    channel.assertQueue('product_queue', {
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log('[Product Queue] Waiting for logs.');

      topics.forEach(function(key) {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, function(msg) {

        console.log(msg);

        const event = {
          event: msg.content.toString(),
          date: msg.content.timestamp,
          topic: msg.fields.routingKey
        }

        Event.create(event)
          .then(e => {
            console.log(e);
          })

        console.log("[Product Queue] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, 
      
      {
        noAck: true
      });
    });

  });
});
}