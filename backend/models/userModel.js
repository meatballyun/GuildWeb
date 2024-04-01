const connection = require('../lib/db');

class UserModel {
	static getUser(ID) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM users WHERE ID = ?', ID, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static getUserNum(EMAIL) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT COUNT(1) AS num FROM users WHERE EMAIL = ?', EMAIL, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static signUp(NAME, EMAIL, PASSWORD) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO users(NAME, EMAIL, PASSWORD) VALUES (?,?,?)', [NAME, EMAIL, PASSWORD], function (err, user) {
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