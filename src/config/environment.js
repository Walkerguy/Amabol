var env = {
    dbHost: 'mongoOrder',
    dbPort: '27016',
    dbDatabase: 'Order',
}

module.exports = {
    env: env,
    dburl: 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase,
    secret:'geheimpie'
};