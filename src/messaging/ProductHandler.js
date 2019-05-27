var amqp = require('amqplib/callback_api');
var mongodb = require('./../../config/mongo.db');
var Event = require('./../../model/event.model');

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

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const event = {
          event: msg.content.toString(),
          date: dateTime,
          topic: msg.fields.routingKey
        }

        Event.create(event)
          .then(e => {
            console.log(e);
          })

        console.log("[Product Queue] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });

  });
});
}