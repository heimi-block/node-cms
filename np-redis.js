// Redis
const redis = require('redis')
let redisClientAvailable = false
let redisClient = null
const memoryClient = {}

exports.redis = null

exports.set = (key, value, callback) => {
	if (redisClientAvailable) {
		// console.log('into redis')
		if (typeof value !== 'string') {
			try {
				value = JSON.stringify(value)
			} catch (err) {
				value = value.toString()
			}
		}
		redisClient.set(key, value, callback)
	} else {
		// console.log('into memory')
		memoryClient[key] = value 
	}
}

exports.get = (key, callback) => {
	if (redisClientAvailable) {
		redisClient.get(key, (err, value) => {
			try {
				value = JSON.parse(value)
			} catch(err) {
				value = value
			}
			callback(err, value)
		})
	} else {
		callback(null, memoryClient[key])
		return memoryClient[key]
	}
}

exports.connect = () => {

	exports.redis = redisClient = redis.createClient({ detect_buffers: true })

	redisClient.on('error', err => {
		redisClientAvailable = false
		console.log('Redis connection failed!' + err)
	})

	redisClient.on('ready', err => {
		console.log('Redis connection success!')
		redisClientAvailable = true
	})

	redisClient.on('reconnecting', err => {
		console.log('Redis is being reconnected!')
	})

	return redisClient
}