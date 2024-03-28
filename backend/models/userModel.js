const connection = require('../lib/db');

class UserModel {
	static getUser(id) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM Users WHERE user_id = ?', id, function (err, rows) {
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
			connection.query('SELECT COUNT(1) AS num FROM Users WHERE email = ?', email, function (err, rows) {
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
			connection.query('INSERT INTO Users(name, email, password) VALUES (?,?,?)', [name, email, password], function (err, user) {
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