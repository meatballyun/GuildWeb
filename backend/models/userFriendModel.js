const connection = require('../lib/db');

class UserFriendModel {
  static addFriend(USER1_ID, USER2_ID) {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO userFriends (USER1_ID, USER2_ID) VALUES (?,?)', [USER1_ID, USER2_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static getFriendStatus(USER1_ID, USER2_ID) {
		return new Promise((resolve, reject) => {
			connection.query('SELECT STATUS FROM userFriends WHERE USER1_ID = ? AND USER2_ID = ?', [USER1_ID, USER2_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static getFriendsById(USER_ID) {
		return new Promise((resolve, reject) => {
			connection.query(`SELECT u.ID, u.NAME, u.IMAGE_URL, u.RANK FROM users u INNER JOIN userFriends uf ON (u.ID = uf.USER1_ID OR u.ID = uf.USER2_ID) WHERE uf.STATUS = 'Confirmed' AND (uf.USER1_ID = ? OR uf.USER2_ID = ?)`, [USER_ID, USER_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	static getFriendsByIdAndName(USER_ID, NAME) {
		return new Promise((resolve, reject) => {			
			connection.query(`SELECT u.ID, u.NAME, u.IMAGE_URL, u.RANK FROM users u INNER JOIN userFriends uf ON (u.ID = uf.USER1_ID OR u.ID = uf.USER2_ID) WHERE uf.STATUS = 'Confirmed' AND (uf.USER1_ID = ? OR uf.USER2_ID = ?) AND u.NAME LIKE ?`, [USER_ID, USER_ID, '%'+ NAME + '%'], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}
	

  static updateFriend(USER1_ID, USER2_ID, STATUS) {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE userFriends SET STATUS = ? WHERE (USER1_ID = ? AND USER2_ID = ?) OR (USER1_ID = ? AND USER2_ID = ?)', [STATUS, USER1_ID, USER2_ID, USER2_ID, USER1_ID], function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

  static deleteFriend(USER1_ID, USER2_ID) {
		return new Promise((resolve, reject) => {
			connection.query('DELETE FROM userFriends WHERE (USER1_ID = ? AND USER2_ID = ?) OR (USER1_ID = ? AND USER2_ID = ?)', [USER1_ID, USER2_ID, USER2_ID, USER1_ID], function (err, rows) {
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