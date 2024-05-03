const connection = require('../lib/db');

class GuildModel {
  static addGuild(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, REFUGE) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO guilds(LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, CABIN) VALUES (?,?,?,?,?)', [LEADER_ID, NAME, DESCRIPTION, IMAGE_URL, REFUGE], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateGuild(ID , NAME, DESCRIPTION, IMAGE_URL) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE guilds SET NAME = ? , DESCRIPTION = ?, IMAGE_URL = ? WHERE ID = ?', [NAME, DESCRIPTION, IMAGE_URL, ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }
  
  static getGuild(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM guilds WHERE ID = ? AND ACTIVE = TRUE', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getGuildByIdAndName(ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM guilds WHERE ID = ? AND NAME LIKE ? AND ACTIVE = TRUE', [ID, '%'+NAME+'%'], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }
  
  static getGuildsByLeader(LEADER_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM guilds WHERE LEADER_ID = ? AND ACTIVE = TRUE', [LEADER_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getGuildsByLeaderAndName(LEADER_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM guilds WHERE LEADER_ID = ? AND NAME LIKE ? AND ACTIVE = TRUE', [LEADER_ID, '%'+NAME+'%'], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
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