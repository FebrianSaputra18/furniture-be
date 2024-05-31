const mongoose = require('mongoose');
const config = require('../app/config');

let isConnected = false;

const connectDB = async () => {
  try {
    if (!isConnected) {
      await mongoose.connect(config.mongoURI);
      console.log('MongoDB Connected');
      isConnected = true;
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit the process on connection error
  }
};

connectDB();

const db = mongoose.connection;

module.exports = db;
