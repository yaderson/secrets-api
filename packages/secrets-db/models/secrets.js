'use strict'
module.exports = (sequelize, DataTypes) => {
  const secrets = sequelize.define('secrets', {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    underscored: true,
    tabelNames: 'secrets'
  })
  secrets.associate = function (models) {
    secrets.belongsTo(models.users, {
      targetKey: 'username',
      foreignKey: 'username',
      as: 'user'
    })
  }
  return secrets
}
