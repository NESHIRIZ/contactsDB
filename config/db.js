const mongoose = require('mongoose');

const connect = async (uri) => {
  console.log('Attempting MongoDB connection...');
  console.log('URI Preview:', uri && uri.includes('localhost') ? uri : '[ATLAS URI hidden]');
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    throw error;
  }
};

const parseMongoError = (error, uri) => {
  const errMsg = error && (error.message || error.toString());
  const isAtlas = uri && uri.includes('mongodb+srv');

  console.error('\n=== MongoDB Connection Error Details ===');
  console.error('URI Type:', isAtlas ? 'ATLAS (mongodb+srv)' : 'LOCAL');
  console.error('Error Name:', error && error.name ? error.name : 'N/A');
  console.error('Error Code:', error && error.code ? error.code : 'N/A');
  console.error('Error Message:', errMsg);

  if (!process.env.MONGODB_URI) {
    console.error('\n❌ ISSUE: MONGODB_URI is not set');
    console.error('SOLUTION: Set MONGODB_URI in .env or environment variables');
  }

  if (errMsg && (errMsg.includes('Invalid connection string') || errMsg.includes('MongoParseError'))) {
    console.error('\n❌ ISSUE: Invalid MongoDB connection string');
    console.error('SOLUTION: Verify the connection string format and credentials');
  } else if (errMsg && errMsg.includes('ECONNREFUSED')) {
    console.error('\n❌ ISSUE: Cannot reach MongoDB');
    console.error('SOLUTION: Ensure MongoDB is running and network access is allowed');
  } else if (errMsg && (errMsg.includes('timed out') || errMsg.includes('timeout'))) {
    console.error('\n❌ ISSUE: Connection timeout');
    console.error('SOLUTION: Check network connectivity and firewall settings');
  } else if (errMsg && (errMsg.toLowerCase().includes('auth') || errMsg.includes('SCRAM')) ) {
    console.error('\n❌ ISSUE: Authentication failed');
    console.error('SOLUTION: Verify username/password in connection string');
  } else {
    console.error('\n❌ ISSUE: Unexpected MongoDB error');
    console.error('Full error:', error);
  }
  console.error('\n======================================\n');
};

module.exports = { connect, parseMongoError };
