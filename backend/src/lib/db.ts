import mysql from 'mysql2';
import { DB_DATABASE, DB_HOST, DB_PASS, DB_USER } from '../config';

const connection = mysql.createConnection({
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASS,
});

connection.connect(function (error) {
  if (error) console.log(error);
  console.log('MySQL has been Connected');
});

export default connection;
