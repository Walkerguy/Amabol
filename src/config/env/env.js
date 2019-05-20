var env = {
    webPort: 3000,
    dbHost: '128.199.61.247',
    dbPort: '27020',
    dbUser: '',
    dbPassword: '',
    dbDatabase: 'shipment'
}

var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;

module.exports = {
    env: env,
    dburl: dburl
};