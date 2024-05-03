const connection = require('../lib/db');

class TaskModel {
  static addTask(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER) {
    const currentTime = (new Date()).getTime();
    let STATUS = 'Established';
    if (currentTime >= INITIATION_TIME){      
      STATUS = 'In Progress';
    };
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO tasks(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS) VALUES (?,?,?,?,?,?,?,?,?)', [CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS], function (err, rows) {
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

  static updateTask(TASK_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER) {
    const initiationTime = new Date(INITIATION_TIME);
    const currentDate = new Date();
    let STATUS = 'Established';
    if (currentDate.toLocaleDateString() === initiationTime.toLocaleDateString()){      
      STATUS = 'In Progress';
    };
    return new Promise((resolve, reject) => {
      connection.query('UPDATE tasks SET NAME = ?, INITIATION_TIME = ?, DEADLINE = ?, DESCRIPTION = ?, TYPE = ?, MAX_ADVENTURER = ?, STATUS = ? WHERE ID = ?', [NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static updateTaskStatus(TASK_ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE tasks SET STATUS = ?, ADVENTURER = 0 WHERE ID = ?`, [STATUS, TASK_ID], function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

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

  static checkInitiationTimeEvent() {
    return new Promise((resolve, reject) => {      
      connection.query(`UPDATE tasks SET STATUS = 'In Progress' WHERE INITIATION_TIME < CURRENT_TIMESTAMP AND STATUS = 'Established' AND ACTIVE = TRUE`, function (err, rows) {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
      });
    });
  }

  static checkDeadlineEvent() {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE tasks SET STATUS = 'Expired' WHERE DEADLINE < CURRENT_TIMESTAMP AND STATUS = 'In Progress' AND ACTIVE = TRUE`, function (err, rows) {
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