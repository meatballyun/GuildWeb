const connection = require('../lib/db');

class UserGuildRelationModel {
  static getOneByGuildAndUser(USER_ID, GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM userGuildRelations WHERE USER_ID = ? AND GUILD_ID = ?',
        [USER_ID, GUILD_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static getAllByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM userGuildRelations WHERE GUILD_ID = ?',
        [GUILD_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static getAllByUser(USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM userGuildRelations WHERE USER_ID = ?',
        [USER_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static getAllByUserAndName(USER_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT ugr.GUILD_ID FROM userGuildRelations ugr INNER JOIN guilds g ON ugr.GUILD_ID = g.ID WHERE ugr.USER_ID = ? AND g.ACTIVE=TRUE AND g.NAME LIKE ?',
        [USER_ID, '%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static create(USER_ID, GUILD_ID, MEMBERSHIP) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO userGuildRelations(USER_ID, GUILD_ID, MEMBERSHIP) VALUES (?,?,?)',
        [USER_ID, GUILD_ID, MEMBERSHIP],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static update(USER_ID, GUILD_ID, MEMBERSHIP) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE userGuildRelations SET MEMBERSHIP = ? WHERE USER_ID = ? AND GUILD_ID = ? ',
        [MEMBERSHIP, USER_ID, GUILD_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static delete(USER_ID, GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM userGuildRelations WHERE USER_ID = ? AND GUILD_ID = ? ',
        [USER_ID, GUILD_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = UserGuildRelationModel;
