'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const DATABASE_URI = require('./config').DATABASE_URI;

// create the database instance
module.exports = new Sequelize(DATABASE_URI, {
  logging: false, 
  native: true 
});

// module.exports = db;
