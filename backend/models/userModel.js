const connection = require('../lib/db');

class UserModel {
	static getUserById(ID) {
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

	static getUserNumByEmail(EMAIL) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT COUNT(1) AS num FROM users WHERE EMAIL = ?', EMAIL, function (err, num) {
				if (err) {
					reject(err);
				} else {
					resolve(num);
				}
			});
		});
	};

	static signUp(NAME, EMAIL, PASSWORD) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO users(NAME, EMAIL, PASSWORD) VALUES (?,?,?)', [NAME, EMAIL, PASSWORD], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static updateUserExp(EXP, ID) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE users SET EXP = ? WHERE ID = ?', [EXP, ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static getUserRankById(ID) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT `RANK` FROM users WHERE ID = ?', [ID], function (err, RANK) {
				if (err) {
					reject(err);
				} else {
					resolve(RANK);
				}
			});
		});
	};

	static updateUserRank(Rank, ID) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE users SET Rank = ? WHERE ID = ?', [Rank, ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

};

module.exports = UserModel;