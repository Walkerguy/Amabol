var env = {
    webPort: 3000,
    dbHost: '128.199.61.247',
    dbPort: '27019',
    dbUser: '',
    dbPassword: '',
    dbDatabase: 'tickets'
}

var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;

module.exports = {
    env: env,
    dburl: dburl
};