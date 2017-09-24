const argv = require('yargs').argv // Yargs帮助您构建交互式命令行工具，通过解析参数和生成优雅的用户界面
exports.MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/devcloud`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
  options:{ 
    useMongoClient: true    /* add other options with , ...*/
  }
}

exports.APP = {
  // ROOT_PATH: __dirname,
	PORT: 7000
}

exports.AUTH = {
	data: argv.auth_data || { user: 'root' },
	jwtTokenSecret: argv.auth_key || 'nodepress',
	defaultPassword: argv.auth_default_password || 'root'
}

exports.INFO = {
	name: '4MEfficient RestfulAPI Framework',
	version: '1.0.0',
	author: '4mdevstudio',
	site: 'https://cms.4-m.cn',
	powered: ['Vue2', 'Nuxt.js', 'React', 'Angular4', 'Bootstrap4', 'jQuery', 'Video.js', 'Node.js', 'MongoDB', 'Express', 'Nginx']
}