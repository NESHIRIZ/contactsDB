const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

// Load local .env only in non-production so production env vars from Render take precedence
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const contactsRouter = require('./routes/contacts');
const companiesRouter = require('./routes/companies');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const prodUrl = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://contactsdb-o4ps.onrender.com';
const baseUrl = isProduction ? prodUrl : `http://localhost:${port}`;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsDB';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || baseUrl,
  credentials: true,
}));

// Set Swagger/OpenAPI servers dynamically based on environment
swaggerDocument.servers = isProduction
  ? [{ url: prodUrl, description: 'Production server' }]
  : [{ url: baseUrl, description: 'Local development server' }];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).send('API is running successfully');
});

app.use('/contacts', contactsRouter);
app.use('/companies', companiesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Contacts API listening on port ${port}`);
      console.log(`Swagger docs available at ${baseUrl}/api-docs`);
      if (swaggerDocument.servers && swaggerDocument.servers.length) {
        console.log('Swagger server set to:', swaggerDocument.servers[0].url);
      }
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  });