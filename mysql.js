const mysql = require('mysql');
const { promisify } = require('bluebird');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'demo'
});
connection.query = promisify(connection.query);

module.exports = connection;
