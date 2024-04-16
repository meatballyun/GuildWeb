const connection = require('../lib/db');

class GuildModel {
  static addGuild(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, REFUGE) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO guilds(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, REFUGE) VALUES (?,?,?,?,?)', [LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, REFUGE], function (err, rows) {
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