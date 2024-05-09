const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

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
            if (rows.length === 0) resolve(false);
            else {
              const guild = convertKeysToCamelCase(rows[0]);
              resolve(guild);
            }
          }
        }
      );
    });
  }

  static create(LEADER_ID, { name, description, imageUrl }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO guilds(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN) VALUES (?,?,?,?,?)',
        [LEADER_ID, name, description, imageUrl, false],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.insertId);
          }
        }
      );
    });
  }

  static addCabin(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO guilds(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN) VALUES (?,?,?,?,?)',
        [LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, true],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows.insertId);
          }
        }
      );
    });
  }

  static update(ID, { name, description, imageUrl }) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE guilds SET NAME = ? , DESCRIPTION = ?, IMAGE_URL = ? WHERE ID = ?',
        [name, description, imageUrl, ID],
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

  static deleteGuild(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE guilds SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows.affectedRows);
        }
      });
    });
  }
}

module.exports = GuildModel;
