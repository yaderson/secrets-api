const db = require('@secrets/db')

function createUser (user, password, fullname) {
  return db.users.create({
    username: user,
    fullname,
    password
  })
}

function listUsers () {
  return db.users.findAndCountAll()
}

module.exports = {
  createUser,
  listUsers
}
