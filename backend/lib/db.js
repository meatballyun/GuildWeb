const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yun',
    password: '123456',
    database: 'Web'
});

connection.connect(function (error) {
    if (!error) {
        console.log('MySQL has been Connected');
    } else {
        console.log(error);
    }
});

module.exports = connection;