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

  static getTaskDetailById(ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM tasks WHERE ID = ? AND ACTIVE = TRUE', [ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM tasks WHERE GUILD_ID = ? AND ACTIVE = TRUE', [GUILD_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static getTaskByGuildAndName(GUILD_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM tasks WHERE GUILD_ID = ? AND NAME LIKE ? AND ACTIVE = TRUE', [GUILD_ID, '%'+NAME+'%'], function (err, rows) {
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
      connection.query('UPDATE tasks SET NAME = ?, INITIATION_TIME = ?, DEADLINE = ?, DESCRIPTION = ?, IMAGE_URL = ?, TYPE = ?, MAX_ADVENTURER = ? WHERE ID = ?', [NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, IMAGE_URL, TYPE, MAX_ADVENTURER, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static cancelTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE tasks SET STATUS = 'Cancelled', ADVENTURER = 0 WHERE ID = ?`, [TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  // "Currently, updating the ADVENTURER when adding adventurers has been achieved through a trigger in MySQL."
  static acceptTask(TASK_ID, ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE tasks SET ADVENTURER = ? WHERE ID = ?', [ADVENTURER, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static maxAccepted(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE tasks SET ACCEPTED = 'Max Accepted' WHERE ID = ?`, [TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static deleteTask(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE tasks SET ACTIVE = FALSE WHERE ID = ?', [TASK_ID], function (err, rows) {
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