// Setup.
const mongoose      = require('mongoose');
const environment   = require('./environment');

// Gebruik ES6 promises i.p.v. Mongoose mpromise.
mongoose.Promise = global.Promise;

mongoose.connect(environment.dburl, { useNewUrlParser: true });
console.log(environment.dburl);
var connection = mongoose.connection
    .once('open', () => console.log('[Database] Connected with MongoDb at ' + environment.env.dbHost + " to database " + environment.env.dbDatabase))
    .on('error', (error) => {
        console.warn('Warning', error.toString()); 
    });

// Connectie.
module.exports = connection;