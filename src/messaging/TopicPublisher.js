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
          durable: true
        });

        // Create timestamp.
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        console.log((msg, { 'timestamp': dateTime }));

        channel.publish(exchange, key, Buffer.from(msg, { 'timestamp': dateTime }));
        console.log(" [x] Sent %s:'%s'", key, msg);
        //res.send('<h1> Topic' + key + ' Send: ' + msg + '</h1>');
      });
    
      setTimeout(function() { 
        connection.close(); 
      }, 500);
    });
}



