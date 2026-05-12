const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const mongodb = require('./data/database');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', require('./routes/contacts'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});