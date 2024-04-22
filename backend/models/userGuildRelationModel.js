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

  static getUserGuildRelationByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userGuildRelations WHERE GUILD_ID = ? AND ACTIVE=TRUE', [GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getUserGuildRelationByUser(USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userGuildRelations WHERE USER_ID = ? AND ACTIVE=TRUE', [USER_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getUserGuildRelationByUserAndName(USER_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT ugr.GUILD_ID FROM userGuildRelations ugr INNER JOIN guilds g ON ugr.GUILD_ID = g.ID WHERE ugr.USER_ID = ? AND g.ACTIVE=TRUE AND g.NAME LIKE ?', [USER_ID, '%'+NAME+'%'], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getUserGuildRelationByGuildAndUser(USER_ID, GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userGuildRelations WHERE USER_ID = ? AND GUILD_ID = ?  AND ACTIVE=TRUE', [USER_ID, GUILD_ID], function (err, rows) {
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
  
  static clearUserGuildRelationsByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE userGuildRelations SET ACTIVE = FALSE WHERE GUILD_ID = ?', [GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteUserGuildRelations(USER_ID, GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM userGuildRelations WHERE USER_ID = ? AND GUILD_ID = ? ', [USER_ID, GUILD_ID], function (err, rows) {
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