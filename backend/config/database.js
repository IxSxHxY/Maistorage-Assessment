const { Sequelize } = require('sequelize');

// console.log(process.env.DATABASE_NAME)
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Connection to MySQL has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
