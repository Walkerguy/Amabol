var amqp = require('amqplib/callback_api');

module.exports.sendMessageWithTopic =  function(msg,key) {
  amqp.connect('amqp://admin:Welkom1@rabbitmq-server:5672/', function(error0, connection) {
    if (error0) {
        console.log(error0);
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          console.log(error1);
        }
        var exchange = 'topic_exchange';
    
        channel.assertExchange(exchange, 'topic', {
          durable: true
        });
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
        //res.send('<h1> Topic' + key + ' Send: ' + msg + '</h1>');
      });
    
      setTimeout(function() { 
        connection.close(); 
      }, 500);
    });
}



