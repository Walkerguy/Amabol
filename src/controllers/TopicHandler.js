var amqp = require('amqplib/callback_api');

exports.listen = function(exchange,topics) {amqp.connect('amqp://localhost', function(error0, connection) {
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
    
        channel.assertQueue('', {
          exclusive: true
        }, function(error2, q) {
          if (error2) {
            throw error2;
          }
          console.log(' [*] Waiting for logs. To exit press CTRL+C');

          for (i=0; i<topics.length; i++) {
            channel.bindQueue(q.queue, exchange, topics[i]);
          }
    
        //   topics.forEach(function(key) {
        //     channel.bindQueue(q.queue, exchange, key);
        //   });
    
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
    if(msg.fields.routingKey == "hello"){
        handleHelloMessage(msg);
    }
    if(msg.fields.routingKey == "doei"){
        handleDoeiMessage(msg);
    }
}

function handleHelloMessage(msg){
  console.log(" [x] Recieved topic" + msg.fields.routingKey + ": %s", msg.content.toString());
}

function handleDoeiMessage(msg){
    console.log(" [x] Recieved topic" + msg.fields.routingKey + ": %s", msg.content.toString());
  }
