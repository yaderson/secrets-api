'use strict'

const { hashPassword, generateRandomkey } = require('@secrets/crypto')

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    randomkey: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user, _) => {
        user.password = await hashPassword(user.password)
        user.randomkey = generateRandomkey()
      }
    }
  })
  users.associate = function (models) {
    users.hasMany(models.secrets, {
      sourceKey: 'username',
      foreignKey: 'username',
      as: 'secrets'
    })
  }
  return users
}
