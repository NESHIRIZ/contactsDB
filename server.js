require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('./config/passport');

const app = express();
const contactsRouter = require('./routes/contacts');
const companiesRouter = require('./routes/companies');
const authRouter = require('./routes/auth');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const prodUrl = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://contactsdb-o4ps.onrender.com';
const baseUrl = isProduction ? prodUrl : `http://localhost:${port}`;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsDB';
const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

const validateEnv = () => {
  const missing = [];
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
  if (isProduction && !process.env.MONGODB_URI) missing.push('MONGODB_URI');
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:', missing.join(', '));
    console.error('Please set the missing variables in your .env or environment variables.');
    process.exit(1);
  }
};

if (!process.env.MONGODB_URI && !isProduction) {
  console.warn('⚠️ MONGODB_URI not set; using local MongoDB:', mongoUri);
}

console.log('\n=== MongoDB Configuration ===');
console.log('MongoDB URI:', mongoUri.includes('localhost') ? mongoUri : '[ATLAS URI hidden]');
console.log('Production mode:', isProduction);
console.log('');

validateEnv();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || baseUrl,
  credentials: true,
}));
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Set Swagger/OpenAPI servers dynamically based on environment
swaggerDocument.servers = isProduction
  ? [{ url: prodUrl, description: 'Production server' }]
  : [{ url: baseUrl, description: 'Local development server' }];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).send('API is running successfully');
});

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);
app.use('/companies', companiesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

const connectToMongo = async (uri) => {
  console.log('Attempting MongoDB connection...');
  console.log('URI Loaded:', !!process.env.MONGODB_URI);
  console.log('URI Preview:', uri.includes('localhost') ? uri : uri.substring(0, 60) + '...');
  
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
  const errMsg = error.message || error.toString();
  const isAtlas = uri.includes('mongodb+srv');
  
  console.error('\n=== MongoDB Connection Error Details ===');
  console.error('URI Type:', isAtlas ? 'ATLAS (mongodb+srv)' : 'LOCAL');
  console.error('Error Name:', error.name || 'N/A');
  console.error('Error Code:', error.code || 'N/A');
  console.error('Error Message:', errMsg);
  
  if (!process.env.MONGODB_URI) {
    console.error('\n❌ ISSUE: MONGODB_URI is not set');
    console.error('SOLUTION:');
    console.error('  • Set MONGODB_URI in .env or your environment');
    console.error('  • Use a valid Atlas connection string, for example:');
    console.error('    mongodb+srv://username:password@cluster0.mongodb.net/contactsDB?retryWrites=true&w=majority');
  }

  if (error.name === 'MongoParseError' || errMsg.includes('Invalid connection string') || errMsg.includes('Invalid connection')) {
    console.error('\n❌ ISSUE: Invalid MongoDB connection string');
    console.error('Possible causes:');
    console.error('  1. Malformed URI format');
    console.error('  2. Missing database name or credentials');
    console.error('  3. Wrong cluster host or DNS syntax');
    console.error('\nSOLUTION:');
    console.error('  • Verify the connection string in .env MONGODB_URI');
    console.error('  • Use the exact Atlas URI format from MongoDB dashboard');
  } else if (errMsg.includes('ECONNREFUSED')) {
    if (isAtlas) {
      console.error('\n❌ ISSUE: Cannot reach MongoDB Atlas');
      console.error('Possible causes:');
      console.error('  1. Network connectivity issue');
      console.error('  2. Atlas cluster is paused or not running');
      console.error('  3. IP address not whitelisted in MongoDB Atlas');
      console.error('  4. Invalid cluster DNS name in connection string');
      console.error('\nSOLUTION:');
      console.error('  • Check MongoDB Atlas dashboard: https://cloud.mongodb.com');
      console.error('  • Verify cluster "cluster0" exists and is running');
      console.error('  • Add your IP address to Network Access');
      console.error('  • Verify connection string credentials (username/password)');
    } else {
      console.error('\n❌ ISSUE: Cannot reach local MongoDB');
      console.error('Possible causes:');
      console.error('  1. MongoDB is not running');
      console.error('  2. MongoDB is not listening on 127.0.0.1:27017');
      console.error('  3. MongoDB service is stopped');
      console.error('\nSOLUTION:');
      console.error('  • Start MongoDB with: mongod');
      console.error('  • Or verify it\'s running: mongosh "mongodb://localhost:27017"');
    }
  } else if (errMsg.includes('ENOTFOUND') || errMsg.includes('querySrv')) {
    console.error('\n❌ ISSUE: DNS resolution failed');
    console.error('Possible causes:');
    console.error('  1. Invalid MongoDB Atlas cluster name in connection string');
    console.error('  2. Network/firewall blocking DNS queries');
    console.error('  3. MongoDB Atlas service is down');
    console.error('\nSOLUTION:');
    console.error('  • Verify connection string from MongoDB Atlas dashboard');
    console.error('  • Check cluster name: "cluster0" (from URI)');
    console.error('  • Test DNS: nslookup _mongodb._tcp.cluster0.a9ltzxv.mongodb.net');
  } else if (errMsg.toLowerCase().includes('auth') || errMsg.includes('SCRAM')) {
    console.error('\n❌ ISSUE: Authentication failed');
    console.error('Possible causes:');
    console.error('  1. Invalid username or password');
    console.error('  2. User permissions issue');
    console.error('  3. Password contains special characters that need URL encoding');
    console.error('\nSOLUTION:');
    console.error('  • Verify credentials in .env MONGODB_URI');
    console.error('  • Check MongoDB Atlas Users section');
    console.error('  • Ensure password is properly URL-encoded if needed');
  } else if (errMsg.includes('timed out') || errMsg.includes('timeout')) {
    console.error('\n❌ ISSUE: Connection timeout');
    console.error('Possible causes:');
    console.error('  1. Network is too slow');
    console.error('  2. MongoDB server is unresponsive');
    console.error('  3. Firewall blocking connection');
    console.error('\nSOLUTION:');
    console.error('  • Check network connectivity');
    console.error('  • Verify MongoDB Atlas cluster is running');
    console.error('  • Check firewall settings');
  } else {
    console.error('\n❌ ISSUE: Unexpected MongoDB error');
    console.error('Full error:', error);
  }
  console.error('\n======================================\n');
};

const startServer = async () => {
  console.log('Starting Contacts API server...\n');
  
  try {
    await connectToMongo(mongoUri);
  } catch (error) {
    console.error('\n❌ MongoDB Atlas connection failed');
    parseMongoError(error, mongoUri);
    console.error('=== NEXT STEPS ===');
    console.error('1. Verify MONGODB_URI in .env or environment variables');
    console.error('2. Confirm Atlas cluster is running and network access is allowed');
    console.error('3. Restart the server after fixing the URI');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`\n✓ Contacts API listening on port ${port}`);
    console.log(`✓ Swagger docs available at ${baseUrl}/api-docs`);
    if (swaggerDocument.servers && swaggerDocument.servers.length) {
      console.log(`✓ Swagger server: ${swaggerDocument.servers[0].url}`);
    }
    console.log('');
  });
};

startServer();