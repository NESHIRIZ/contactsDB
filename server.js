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
const productsRouter = require('./routes/products');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const swaggerDocument = require('./swagger.json');
const db = require('./config/db');

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
app.use('/products', productsRouter);
app.use('/reviews', reviewsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

const startServer = async () => {
  console.log('Starting Contacts API server...\n');
  try {
    await db.connect(mongoUri);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed');
    db.parseMongoError(error, mongoUri);
    console.error('=== NEXT STEPS ===');
    console.error('1. Verify MONGODB_URI in .env or environment variables');
    console.error('2. Confirm MongoDB is running and network access is allowed');
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

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;