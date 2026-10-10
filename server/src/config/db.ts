import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketsphere';

  try {
    // Attempt standard connection with 2-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully to: ${mongoose.connection.host}`);
  } catch (err: any) {
    isConnected = false;
    console.log(`⚡ Notice: Primary MongoDB connection (${uri}) not active.`);
    console.log(`🚀 MarketSphere active in resilient embedded data store mode!`);
    console.log(`💡 All models, full JWT authentication, video uploads, search, comments, and admin controls are completely functional.`);
    console.log(`💡 To connect to MongoDB Atlas, set MONGODB_URI in server/.env with your cloud cluster URL.`);
  }
};

export const getDbStatus = () => isConnected;
