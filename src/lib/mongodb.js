const mongoose = require('mongoose');

const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    // Use current connection
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = connectMongoDB;
