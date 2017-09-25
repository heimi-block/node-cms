const argv = require('yargs').argv // Yargs帮助您构建交互式命令行工具，通过解析参数和生成优雅的用户界面
exports.MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/cms`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password',
  options:{ 
    useMongoClient: true    /* add other options with , ...*/
  }
}

exports.APP = {
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
	site: 'http://cms.4-m.cn',
	powered: ['Node.js', 'MongoDB', 'Express', 'Nginx']
}

exports.GOOGLEANALTTICS = {
  type: 'service_account',
	project_id: 'poetic-result-176709',
	private_key_id: '37dc2864a7051185b93b240fc6bdc65130cca5cd',
	private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCz7WS6fi0lM8xH\n2P7Azm2m39GIAmitenqG4oQJxxwhUKe9zTpiljNhclgxHG96Bt12ZLGZZoynGgDG\nF69cMBbsRwguWpAgi497WtMcrkejjfqkPLj5NzwQDsDo2sr9BUdtnx3oQMZ5Zm11\nfN67tX0xQ8xFPKZVndj/HboR50vnucotfpJeJBOpxhPSncVX/IV7SnwGqaz4bkt9\nr6Kv1chpT/L6eLqY0nmmpJmjiZzqXYXnli0WdyN+1TECLOwO3ym/oQ1ve5S2w8nM\nVUoD3EhupLJcLNjlT9avQwittaOY4RwjVnZlvIBeBPEeLiV0epjSMcGErYIQYdmI\nQoNS0iChAgMBAAECggEAOMGcsZtVoFObj9pqWeWD/0zA6rdfz8E/30aawf7V58hq\ncVvInAqnQIjyOuOuYn7B4zPWNf58RcXVEqesAFeHE5dAhGa66hk79Hxs9bIgFP6X\nXrFs4+hBgQs2XP2PZIsCwhicNYQhV3Aw/QubsviH+j9Zs0lzarR1G9yDslwUvI58\nh94UIUI5qDtCkOcymJg8DB4mg1AxWi2VkuNBXc+739VhAHtJxyWjaHle7edWMFON\nY5sFSSmEms55dnXLgjhoUtwvF0C6UwCy5xbtZzyQH+YCHuc9WHwkQ+VA5J8tyIwu\nxZTCHaO4gdM+hlc+v/t/uTkTryLh3d8ro/ITTcAcRQKBgQD8IK8wdF9RDF85AoEM\nX45KeZuF3fk+FCZ2kFc2gfIQVQaDWkuFkjo5/odu0dCUw/7b79P1ZCZCh3RzQH8G\nVISlp6Uc56ubsdEIrWqWiFa0MfqCMkGplScVvWcJUjyZmYZE/HEWcchbgYucFPaW\nFvFUsKW5wxjzhA0YoPGLF/NVvwKBgQC2sNTuIzKs6eT7Lk1x1LggR2+meqIVxuIn\n0Kr0Qi88f87UvLEWCY/CXG4P+AVi2W9/EfG7z82RsmCNWd3rkpqt9VRR3shWZIwM\nZsd6FXiu/de4p1HmtpZ8N4vRd2JGBdHA2j/J/6VCsr7MVFlwil+AOwvzceYs1aby\nklIhbm3hnwKBgA1oO4irF4p6yvGAJZaf2jQxpUiIFkHr1mPFpy2Z2WJu8wq3GX7/\n2KLO2yrUc3AFwB638SCCc9pj05hxXI/cnLUmZgxUcXa1DPWWKy3YECxC4BxeScmX\nyd1JFhqTye8tD8vJVMYpxMrA58ikALzYeXrUbeuj6UbBxeSCYnXQDzuHAoGBAKDd\n3OFEhR7VZhf3kaImWWuy+5FwcsESO5ormB01Gjr/n7Sb4qMxEDFpClFtZ/C+3fra\nZi2msbEVjQdqlosUsLd1SyY8MdRA/UD+T7Akr/wG8albTDcHmEMQ9kEgCpz2Ctjy\nVTEdtvugQXnS3F7IuYdEdyWKqc/Y4gS+6ysc/gypAoGAE/3yEQpLJoinrQvnoM8S\n5fauJfWIUASGbcMX2isscNinIYMsKHSJ6jDsZ4Nrn437AHgoPqv3RNUnycD8jEDy\nLhiLQ6BvFv0ZnZr2d1DJy4kl2nbzo/RHJaqMmnU/bQIhDpto4zOAxkQB9AKHqy+P\nnJw5V0aEqxjs9xrjye4w7pw=\n-----END PRIVATE KEY-----\n',
	client_email: 'getdataformapi@poetic-result-176709.iam.gserviceaccount.com',
	client_id: '115919698695518948223',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://accounts.google.com/o/oauth2/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/getdataformapi%40poetic-result-176709.iam.gserviceaccount.com'
}

