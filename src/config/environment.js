var env =
{
    dbHost:             '128.199.61.247',
    dbPortRead:         '27017',
    dbPortWrite:        '27023',
    dbDatabaseRead:     'AccountRead',
    dbDatabaseWrite:    'AccountWrite'
    //JWT_SECRET:     process.env.JWT_SECRET || 'SECRET#123',
    //JWT_EXP:        process.env.JWT_EXP || '10m'
}

module.exports =
{
  //mongodb://testuser:user1test@ds145921.mlab.com:45921/games
    env: env,
    dburlread: "mongodb://" + env.dbHost + ":" + env.dbPortRead + "/" + env.dbDatabaseRead,
    dburlwrite: "mongodb://" + env.dbHost + ":" + env.dbPortWrite + "/" + env.dbDatabaseWrite,
};
