const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const MONGODB_URI = process.env.PROXI_URI;

console.log('Testing MongoDB connection with Mongoose...');
console.log('URI found:', MONGODB_URI ? 'Yes' : 'No');

if (!MONGODB_URI) {
  console.error('❌ MongoDB URI not found in config.env');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully with Mongoose!');

    // Test the connection
    try {
      await mongoose.connection.db.admin().ping();
      console.log('✅ MongoDB ping successful');
    } catch (pingErr) {
      console.log('⚠️  Ping failed:', pingErr.message);
    }

    // Test collection access
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('✅ Collections accessible:', collections.length);
      console.log('Collections:', collections.map(c => c.name));
    } catch (colErr) {
      console.log('⚠️  Collection access failed:', colErr.message);
    }

    // Test User model
    try {
      const User = require('./models/User');
      const userCount = await User.countDocuments();
      console.log('✅ User model working, documents count:', userCount);
    } catch (modelErr) {
      console.log('⚠️  User model test failed:', modelErr.message);
    }

    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', err.message);
    console.error('Code:', err.code);

    if (err.message.includes('authentication failed')) {
      console.error('💡 Check your username and password in the connection string');
    } else if (err.message.includes('network')) {
      console.error('💡 Check your internet connection and MongoDB Atlas cluster status');
    } else if (err.message.includes('timeout')) {
      console.error('💡 Check if your IP address is whitelisted in MongoDB Atlas');
    }

    process.exit(1);
  });
