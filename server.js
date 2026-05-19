const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

dotenv.config();

const app = express();
const mongodb = require('./data/database');
const swaggerDocument = require('./swagger.json');
const contactsRouter = require('./routes/contacts');

const port = process.env.PORT || 3000;

app.use(express.json());
// Allow cross-origin requests (needed if Swagger UI or clients call from different origin)
app.use(cors());
// Ensure Swagger servers entry matches deployed BASE_URL (Render) or localhost
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;
if (!swaggerDocument.servers) {
  swaggerDocument.servers = [];
}
swaggerDocument.servers[0] = { url: baseUrl };

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', contactsRouter);

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});