var env = {
    dbHost: '128.199.61.247',
    dbPort: '27016',
    dbDatabase: 'Order',
}

module.exports = {
    env: env,
    dburl: 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase,
    secret:'geheimpie'
};