var amqp = require('amqplib/callback_api');

exports.listen = function(queue) {amqp.connect('amqp://admin:Welkom1@128.199.61.247', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

      channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
      }, {
        noAck: true
      });
    });
  });
}