const connection = require('../lib/db');

class ConfirmationEmailModel {
  static addConfirmationEmail(USER, TYPE, CODE) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO confirmationEmails(USER_ID, TYPE, CODE) VALUES (?,?,?)', [USER, TYPE, CODE], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static getConfirmationEmailsByUserId(USER_ID, TYPE) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM confirmationEmails WHERE USER_ID = ? AND TYPE = ? ORDER BY CREATE_TIME DESC', [USER_ID, TYPE], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static updateConfirmationEmail(USER_ID, STATUS, TYPE) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE confirmationEmails SET STATUS = ? WHERE USER_ID = ? AND TYPE = ?', [STATUS, USER_ID, TYPE], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
};

module.exports = ConfirmationEmailModel;