var env = {
    webPort: '3000',
    dbHost: '128.199.61.247',
    // Activate this for the LIVE version; dbHost: 'mongoShoppingCart',
    dbPort: '27018',
    dbUser: '',
    dbPassword: '',
    dbDatabase: 'shoppingcart'
}

var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;

module.exports = {
    env: env,
    dburl: dburl
};