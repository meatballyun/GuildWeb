const connection = require('../lib/db');

class UserModel {
	static getUser(email) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM user WHERE email = ?', email, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static getUserNum(email) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT COUNT(1) AS num FROM user WHERE email = ?', email, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static signUp(name, email, password) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO user(name, email, password) VALUES (?,?,?)', [name, email, password], function (err, user) {
				if (err) {
					reject(err);
				} else {
					resolve('');
				}
			});
		});
	}

};

module.exports = UserModel;