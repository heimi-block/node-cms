// module.exports = {
//   mongodb: 'mongodb://localhost:27017/devcloud',
//   redis: {
//     'host': 'localhost',
//     'port': '6379',
//     'db': 1,
//     'ttl': 1800,
//     'logErrors': true
//   }
// }

const argv = require('yargs').argv

exports.MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/devcloud`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password'
}