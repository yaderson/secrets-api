'use strict'

const Redis = require('ioredis')
const db = require('./models')

db.createRedisClient = () => {
  return new Redis({
    host: 'redis-18316.c16.us-east-1-2.ec2.cloud.redislabs.com',
    port: '18316',
    password: 'yader'
  })
}

module.exports = db
