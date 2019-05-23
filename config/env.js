var env = {
  dbHost: 'mongoAccountRead',
  dbPort: '27017',
  dbUser: '',
  dbPassword:'',
  dbDatabase: 'account_read'
}

var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;

module.exports = {
  env: env,
  dburl: dburl,
  'secret':'geheimpie'
};
