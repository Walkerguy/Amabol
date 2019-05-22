// var amqp = require('amqplib/callback_api');
//
// exports.sendMessage = function(req,res){
//   amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//       if (error1) {
//         throw error1;
//       }
//       var queue = 'hello';
//       var msg = req.params.text || 'Hello world';
//
//       channel.assertQueue(queue, {
//         durable: false
//       });
//
//       channel.sendToQueue(queue, Buffer.from(msg));
//       console.log(" [x] Send %s", msg);
//       res.send('<h1> Send: ' + msg + '</h1>');
//     });
//     setTimeout(function() {
//       connection.close();
//       //process.exit(0)
//     }, 500);
//   });
// }
//
//
//
