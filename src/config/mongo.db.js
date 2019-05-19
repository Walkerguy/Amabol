// Setup.
const mongoose      = require('mongoose');
const environment   = require('./environment');

// Gebruik ES6 promises i.p.v. Mongoose mpromise.
mongoose.Promise = global.Promise;
console.log("test " + environment.dburl);
mongoose.connect(environment.dburl);
var connection = mongoose.connection
    .once('open', () => console.log('[Database] Verbonden met Mongo op ' + environment.dburl))
    .on('error', (error) => {console.warn('Warning', error.toString());
  });

// Connectie.
module.exports = connection;
