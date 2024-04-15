const connection = require('../lib/db');

class UserModel {
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

	static getUserByName(NAME) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT * FROM users WHERE NAME LIKE ?`, ['%'+NAME+'%'], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static getUserByEmail(EMAIL) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM users WHERE EMAIL = ?', EMAIL, function (err, num) {
				if (err) {
					reject(err);
				} else {
					resolve(num);
				}
			});
		});
	};

	static updateUserInfo(ID, NAME, IMAGE_URL, CARBS, PRO, FATS, KCAL) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE users SET NAME =?, IMAGE_URL = ?, CARBS = ?, PRO = ?, FATS = ?, KCAL = ? WHERE ID = ?', [NAME, IMAGE_URL, CARBS, PRO, FATS, KCAL, ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

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

	static updateUserRank(RANK, ID) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE users SET `RANK` = ? WHERE ID = ?', [RANK, ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	};

	static updateUserStatus(STATUS, ID) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE users SET STATUS = ? WHERE ID = ?', [STATUS, ID], function (err, rows) {
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