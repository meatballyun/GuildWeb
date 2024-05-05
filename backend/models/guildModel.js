const connection = require('../lib/db');

class GuildModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM guilds WHERE ID = ? AND ACTIVE = TRUE',
        [ID],
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

  static create(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO guilds(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN) VALUES (?,?,?,?,?)',
        [LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN],
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

  static update(ID, NAME, DESCRIPTION, IMAGE_URL) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE guilds SET NAME = ? , DESCRIPTION = ?, IMAGE_URL = ? WHERE ID = ?',
        [NAME, DESCRIPTION, IMAGE_URL, ID],
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

  static deleteGuild(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE guilds SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = GuildModel;
