const connection = require('../lib/db');

class TaskTemplateModel {
  static DATE_ADD(CURRENT , INTERVAL, UNIT) {
    const query = 'SELECT DATE_ADD(?, INTERVAL ? ' + UNIT + ');';
    return new Promise((resolve, reject) => {
      connection.query(query, [CURRENT, INTERVAL], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static addTaskTemplate(CREATOR_ID, GUILD_ID, NAME, DESCRIPTION,  GENERATION_TIME, DEADLINE, TYPE, MAX_ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO taskTemplates(CREATOR_ID, GUILD_ID, NAME, DESCRIPTION,  GENERATION_TIME, DEADLINE, TYPE, MAX_ADVENTURER) VALUES (?,?,?,?,?,?,?,?)', [CREATOR_ID, GUILD_ID, NAME, DESCRIPTION,  GENERATION_TIME, DEADLINE, TYPE, MAX_ADVENTURER], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskTemplateById(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM taskTemplates WHERE ID = ? AND ACTIVE = TRUE', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskTemplate() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM taskTemplates WHERE ENABLED = TRUE AND ACTIVE = TRUE', function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskTemplateByGuildId(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM taskTemplates WHERE GUILD_ID = ? AND ACTIVE = TRUE', [GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskTemplateByGuildIdAndName(GUILD_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM taskTemplates WHERE GUILD_ID = ? AND NAME LIKE ? AND ACTIVE = TRUE', [GUILD_ID, '%'+NAME+'%'], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateTaskTemplate(ID, ENABLED, NAME, DESCRIPTION,  GENERATION_TIME, DEADLINE, TYPE, MAX_ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE taskTemplates SET  ENABLED = ?, NAME = ?, DESCRIPTION = ?,  GENERATION_TIME = ?, DEADLINE = ?, TYPE = ?, MAX_ADVENTURER = ? WHERE ID = ?', [ ENABLED, NAME, DESCRIPTION,  GENERATION_TIME, DEADLINE, TYPE, MAX_ADVENTURER, ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateTaskTemplateTime(ID, GENERATION_TIME, DEADLINE) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE taskTemplates SET GENERATION_TIME = ?, DEADLINE = ? WHERE ID = ?', [GENERATION_TIME, DEADLINE, ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteTaskTemplate(ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE taskTemplates SET ACTIVE = FALSE WHERE ID = ?', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }
}

module.exports = TaskTemplateModel;