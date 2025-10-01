const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - using local MongoDB for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-meow';
    
    const conn = await mongoose.connect(mongoURI, {
      // Additional options for MongoDB Atlas
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.error('Please check your MongoDB Atlas connection string in .env file');
    process.exit(1);
  }
};

module.exports = connectDB;

