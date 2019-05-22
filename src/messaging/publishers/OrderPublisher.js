var amqp = require('amqplib/callback_api');

module.exports.sendMessageWithTopic =  function(msg,key) {
  amqp.connect('amqp://admin:Welkom1@128.199.61.247', function(error0, connection) {
    if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

        var exchange = 'topic_exchange';

        channel.assertExchange(exchange, 'topic', {
          durable: false
        });
        
        // The actual sending.
        channel.publish(exchange, key, Buffer.from(msg));
        console.log("[Order Service] Sent %s:'%s'", key, msg);
      });
    
      setTimeout(function() { 
        connection.close(); 
      }, 500);
    });
}



