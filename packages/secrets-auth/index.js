'use strict'

const db = require('@secrets/db')
const { generateKey, comparePassword } = require('@secrets/crypto')

async function getAuthenticateUser (username, pass) {
  const user = await db.users.findOne({ where: { username } })

  if (!user) { return false }

  const hashed = user.password

  if (await comparePassword(pass, hashed)) {
    const redisClient = db.createRedisClient()
    await redisClient.set(username, generateKey(pass), 'EX', 3 * 600)
    redisClient.disconnect()
    return user
  }

  return null
}

async function authenticate (username, pass) {
  const user = await getAuthenticateUser(username, pass)

  if (user) {
    return user
  }

  return false
}

async function getSecretkey (username) {
  const redisClient = db.createRedisClient()
  const user = await redisClient.get(username)
  redisClient.disconnect()
  return user
}

async function isAuthenticated (username) {
  return await getSecretkey(username) != null
}

module.exports = {
  authenticate,
  getSecretkey,
  isAuthenticated
}
