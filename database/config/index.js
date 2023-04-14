const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/../../.env') });

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  pool: {
    min: 2,
    max: 10
  }
});

const bookshelf = require('bookshelf')(knex);
const jsonColumns = require('bookshelf-json-columns');
const virtualPlugin = require('bookshelf-virtuals-plugin');

bookshelf.plugin(jsonColumns);
bookshelf.plugin(virtualPlugin);
module.exports = bookshelf;
