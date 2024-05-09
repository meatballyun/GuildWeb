const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

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
            if (rows.length === 0) resolve(false);
            else {
              const userGuildRelation = convertKeysToCamelCase(rows[0]);
              resolve(userGuildRelation);
            }
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
            if (rows.length === 0) resolve(false);
            else {
              const userGuildRelations = rows.map(convertKeysToCamelCase);
              resolve(userGuildRelations);
            }
          }
        }
      );
    });
  }

  static getAllByUser(USER_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT ugr.* FROM userGuildRelations ugr INNER JOIN guilds g ON ugr.GUILD_ID = g.ID WHERE ugr.USER_ID = ? AND g.ACTIVE=TRUE ',
        [USER_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const userGuildRelations = rows.map(convertKeysToCamelCase);
              resolve(userGuildRelations);
            }
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
            if (rows.length === 0) resolve(false);
            else {
              const userGuildRelations = rows.map(convertKeysToCamelCase);
              resolve(userGuildRelations);
            }
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
            resolve(rows.affectedRows);
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
            resolve(rows.affectedRows);
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
            resolve(rows.affectedRows);
          }
        }
      );
    });
  }
}

module.exports = UserGuildRelationModel;
