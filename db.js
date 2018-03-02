var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:my_password@localhost:5432/postgres')

module.exports = sequelize
