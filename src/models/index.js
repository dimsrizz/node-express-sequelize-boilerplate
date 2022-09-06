/* eslint-disable */

'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config');
const db = {};
require('dotenv').config();

// Automatically pass transactions to all queries
const namespace = cls.createNamespace('cls-transaction');
Sequelize.useCLS(namespace);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    logging: false,
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(config.development.url, {
    logging: false,
    dialect: 'postgres',
  });
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
