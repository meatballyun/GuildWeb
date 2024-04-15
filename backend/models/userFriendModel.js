const connection = require('../lib/db');

class UserFriendModel {
  static addFriend(USER_ID, FRIEND_ID) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO userFriends (USER_ID, FRIEND_ID) VALUES (?,?,?)', [USER_ID, FRIEND_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static getFriend(USER_ID, STATUS) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT FRIEND_ID FROM userFriends WHERE USER_ID = ? AND STATUS = ?', [USER_ID, STATUS], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static getStatus(USER_ID, FRIEND_ID) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT STATUS FROM userFriends WHERE USER_ID = ? AND FRIEND_ID = ?', [USER_ID, FRIEND_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static updateFriend(USER_ID, FRIEND_ID, STATUS) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE userFriends SET STATUS = ? WHERE USER_ID = ? AND FRIEND_ID = ?', [STATUS, USER_ID, FRIEND_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

};

module.exports = UserFriendModel;