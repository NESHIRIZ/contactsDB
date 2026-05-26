const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const mongodb = require('./data/database');
const swaggerDocument = require('./swagger.json');
const apiRouter = require('./routes');

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

app.use(express.json());
app.use(cors());

if (!swaggerDocument.servers) {
  swaggerDocument.servers = [];
}
swaggerDocument.servers[0] = { url: baseUrl };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRouter);

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Project 2 API listening on port ${port}`);
    console.log(`Swagger UI available at ${baseUrl}/api-docs`);
  });
});
