var privateSettings  = require('./settings.private');

module.exports = {
    servicePort: process.env.PORT || 5000,
    morganLevel: 'dev',
    mysql: {
      host     : process.env.DB_MYSQL_HOST || privateSettings.mysql.host,
      user     : process.env.DB_MYSQL_USER ||  privateSettings.mysql.user,
      password : process.env.DB_MYSQL_PASSWORD ||  privateSettings.mysql.password,
      database : process.env.DB_MYSQL_SCHEMA ||  privateSettings.mysql.database
    }
};
