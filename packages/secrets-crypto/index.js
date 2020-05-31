'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const saltRounds = 5
const algorithm = 'aes-256-cbc'

async function hashPassword (pass) {
  return bcrypt.hash(pass, saltRounds)
}

async function comparePassword (pass, hash) {
  const result = await bcrypt.compare(pass, hash)
  return result
}

function encrypt (data, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))

  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return encrypted.toString('hex')
}

function decrypt (data, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))
  let decrypted = decipher.update(Buffer.from(data, 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

function generateRandomkey () {
  return crypto.randomBytes(16).toString('hex')
}

function generateKey (pass) {
  return crypto.createHash('sha256').update(pass).digest('hex')
}

module.exports = {
  hashPassword,
  comparePassword,
  encrypt,
  decrypt,
  generateRandomkey,
  generateKey
}
