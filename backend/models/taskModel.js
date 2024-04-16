const connection = require('../lib/db');

class TaskModel {
  static addTask(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO tasks(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER) VALUES (?,?,?,?,?,?,?,?,?)', [CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateTask(TASK_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE tasks SET NAME = ?, INITIATION_TIME = ?, DEADLINE = ?, DESCRIPTION = ?, IMAGE_URL = ?, TYPE = ?, MAX_ADVENTURER = ?) WHERE ID = ?', [NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

}

module.exports = TaskModel;