const mongoose = require('mongoose');
const colors = require('colors');
const { DB_URL } = require('./index');

const connect = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Database connected'.bgCyan);
  } catch (error) {
    console.error('Database connection error:', error.message.red);
    process.exit(1);
  }
};

module.exports = connect;
