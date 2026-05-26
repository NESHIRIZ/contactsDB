const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const mongodb = require('./data/database');
const contactsRouter = require('./routes/contacts');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

app.use(express.json());
app.use(cors());

swaggerDocument.servers = [{ url: baseUrl }];
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

mongodb.initDb((err) => {
  if (err) {
    console.error('Database initialization failed', err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Contacts API listening on port ${port}`);
    console.log(`Swagger docs available at ${baseUrl}/api-docs`);
  });
});