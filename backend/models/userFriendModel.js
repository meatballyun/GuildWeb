const connection = require('../lib/db');

class UserFriendModel {
  static addFriend(USER_ID, FRIEND_ID) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO userFriends (USER_ID, FRIEND_ID) VALUES (?,?)', [USER_ID, FRIEND_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static getFriends(USER_ID) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT u.ID, u.NAME, u.IMAGE_URL, u.RANK FROM users u INNER JOIN userFriends uf ON u.ID = uf.FRIEND_ID WHERE uf.USER_ID = ? AND STATUS = 'Confirmed'`, USER_ID, function (err, rows) {
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