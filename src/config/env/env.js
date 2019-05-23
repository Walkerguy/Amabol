var env = {
    webPort: '3000',
    dbHost: 'mongoInventory',
    dbPort: '27021',
    dbUser: '',
    dbPassword: '',
    dbDatabase: 'inventory'
}

var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;

module.exports = {
    env: env,
    dburl: dburl
};