const db = require('@secrets/db')
const { comparePassword, hashPassword, generateRandomkey, generateKey } = require('@secrets/crypto')
const { updateAllSecrets } = require('./secrets.js')
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
async function changePassword (username, oldPassword, newPassword) {
  const user = await db.users.findOne({where: { username }})//Find user
  const compare = await comparePassword(oldPassword, user.password)
  if(!compare) throw new Error('Invalid Password')//If not is correct ol pass return invalid

  const oldRandomKey = user.randomkey //Old randomKey
  
  const newRandomKey = await generateRandomkey() //new randomKey
  const newSecretKey = await generateKey(newPassword)//Secret key For encrypt secrets with new pass
  user.password = await hashPassword(newPassword)//pass hashed
  user.randomkey = newRandomKey
  await user.save()//save new randomkey adn pass 
  await updateAllSecrets(username, oldRandomKey, newRandomKey, newSecretKey)//Update al secrets
  

}
module.exports = {
  createUser,
  listUsers,
  changePassword
}
