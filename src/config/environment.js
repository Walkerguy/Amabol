var env =
{
    dbHost:         '128.199.61.247',
    dbPort:         '27017',
    dbDatabase:     'Account'
    //JWT_SECRET:     process.env.JWT_SECRET || 'SECRET#123',
    //JWT_EXP:        process.env.JWT_EXP || '10m'
}

module.exports =
{
  //mongodb://testuser:user1test@ds145921.mlab.com:45921/games
    env: env,
    dburl: "mongodb://" + env.dbHost + ":" + env.dbPort + "/" + env.dbDatabase,
    //dburl: "mongodb://localhost/" + env.dbDatabase,
    //JWT_SECRET:  env.JWT_SECRET,
    //JWT_EXP: env.JWT_EXP
};
