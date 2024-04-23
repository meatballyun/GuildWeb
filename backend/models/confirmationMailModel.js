const connection = require('../lib/db');

class ConfirmationMailModel {
  static addConfirmationMail(USER, TYPE, CODE) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO confirmationMails(USER_ID, TYPE, CODE) VALUES (?,?,?)', [USER, TYPE, CODE], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static getConfirmationMailByUserId(USER_ID) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM confirmationMails WHERE USER_ID = ?', USER_ID, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static updateConfirmationMail(USER_ID, STATUS) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE confirmationMails SET STATUS = ? WHERE USER_ID = ?', [STATUS, USER_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
};

module.exports = ConfirmationMailModel;