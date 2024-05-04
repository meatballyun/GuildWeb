const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

connection.connect(function (error) {
  if (!error) {
    console.log('MySQL has been Connected');
  } else {
    console.log(error);
  }
});

module.exports = connection;
