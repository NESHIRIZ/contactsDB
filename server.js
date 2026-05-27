const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const contactsRouter = require('./routes/contacts');
const companiesRouter = require('./routes/companies');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsDB';

app.use(express.json());
app.use(cors());

swaggerDocument.servers = [{ url: baseUrl }];
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  });