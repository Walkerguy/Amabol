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
        var exchange = 'topic_logs';
        var args = process.argv.slice(2);
        //var key = req.params.topic || 'anonymous.info';
        //var msg = req.params.text || 'Hello World!';
    
        channel.assertExchange(exchange, 'topic', {
          durable: false
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