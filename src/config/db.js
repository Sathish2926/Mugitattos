const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mugitattoo';
  
  try {
    // Determine if using local or cloud MongoDB
    const isMongoDBAtlas = uri.includes('mongodb+srv://');
    const connectionType = isMongoDBAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB';
    
    console.log(`[MONGODB] Connecting to ${connectionType}...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    });
    
    // Get MongoDB connection info
    const db = mongoose.connection;
    const adminDb = db.getClient().db().admin();
    
    console.log(`[MONGODB] ✓ Connected successfully`);
    console.log(`[MONGODB] Type: ${connectionType}`);
    console.log(`[MONGODB] Database: mugitattoo`);
    
    if (isMongoDBAtlas) {
      console.log(`[MONGODB] Cluster: ${uri.match(/cluster\d+/)?.[0] || 'Unknown'}`);
      console.log(`[MONGODB] Region: Multi-region (MongoDB Atlas)`);
    }
    
  } catch (err) {
    console.error('[MONGODB] ✗ Connection failed:', err.message);
    if (err.message.includes('authentication failed')) {
      console.error('[MONGODB] Check your MongoDB Atlas credentials');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('[MONGODB] Local MongoDB is not running. Start with: mongod');
    }
    throw err;
  }
};

module.exports = connectDB;
