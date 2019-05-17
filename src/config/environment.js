var env = {
    dbHost: process.env.DB_HOST || '128.199.61.247',
    dbPort: process.env.DB_PORT || '27016',
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
  }
  
  var dburl = 'mongodb://' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase;
  