const connection = require('../lib/db');

class UserGuildRelationModel {
  static addUserGuildRelation(USER_ID, GUILD_ID, MEMBERSHIP) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO userGuildRelations(USER_ID, GUILD_ID, MEMBERSHIP) VALUES (?,?,?)', [USER_ID, GUILD_ID, MEMBERSHIP], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getMembership(USER_ID, GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT MEMBERSHIP FROM userGuildRelations WHERE USER_ID = ? AND GUILD_ID = ?', [USER_ID, GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateUserGuildRelations(USER_ID, GUILD_ID, MEMBERSHIP) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE userGuildRelations SET MEMBERSHIP = ? WHERE USER_ID = ? AND GUILD_ID = ? ', [MEMBERSHIP, USER_ID, GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = UserGuildRelationModel;