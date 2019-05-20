var amqp = require('amqplib/callback_api');

exports.sendMessage = function(req,res){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
      }
      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

        var exchange = 'logs';
        var msg = req.params.text || 'Hello World!';
    
        channel.assertExchange(exchange, 'fanout', {
          durable: false
        });
        
        channel.publish(exchange, '', Buffer.from(msg));
        console.log(" [x] Published %s", msg);
        res.send('<h1> Published: ' + msg + '</h1>');
      });
    
      setTimeout(function() { 
        connection.close(); 
      }, 500);
    });
}
  
