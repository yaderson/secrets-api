const db = require('@secrets/db')
const { getSecretkey } = require('@secrets/auth')
const { encrypt, decrypt } = require('@secrets/crypto')

async function createSecret (username, name, value) {
  try {
    const user = await db.users.findOne({ where: { username } })

    if (!user) { throw new Error('User not found') }

    const secretKey = await getSecretkey(username)

    const encrypted = encrypt(String(value), secretKey, user.randomkey)

    return db.secrets.create({
      username,
      name,
      value: encrypted
    })
  } catch (err) {
    console.log(err)
  }
}

function listSecrets (username) {
  console.log(username)
  return db.secrets.findAndCountAll({ where: { username } })
}

async function getSecret (username, name) {
  const user = await db.users.findOne({ where: { username } })
  if (!user) { throw new Error(`User ${username} not found`) }

  const secretKey = await getSecretkey(username)
  const randomkey = user.randomkey

  const secret = await db.secrets.findOne({ where: { username, name } })

  if (!secret) { return null }

  const decrypted = decrypt(String(secret.value), secretKey, randomkey)

  secret.value = decrypted

  return secret
}

async function updateSecret (username, name, value) {
  const user = await db.users.findOne({ where: { username } })

  if (!user) { throw new Error(`User ${username} not found`) }

  const secretKey = await getSecretkey(username)
  const encryptedValue = encrypt(String(value), secretKey, user.randomkey)

  return db.secrets.update({ value: encryptedValue }, {
    where: { username, name }
  })
}

function deleteSecret (username, name) {
  return db.secrets.destroy({
    where: {
      username,
      name
    }
  })
}

module.exports = {
  createSecret,
  listSecrets,
  getSecret,
  updateSecret,
  deleteSecret
}
