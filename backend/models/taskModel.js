const connection = require('../lib/db');

class TaskModel {
  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM tasks WHERE ID = ? AND ACTIVE = TRUE',
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

  static getAllByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM tasks WHERE GUILD_ID = ? AND ACTIVE = TRUE',
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

  static getAllByGuildAndName(GUILD_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM tasks WHERE GUILD_ID = ? AND NAME LIKE ? AND ACTIVE = TRUE',
        [GUILD_ID, '%' + NAME + '%'],
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

  static create(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER) {
    const currentTime = new Date().getTime();
    let STATUS = 'Established';
    if (currentTime >= new Date(INITIATION_TIME).getTime()) {
      STATUS = 'In Progress';
    }
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO tasks(CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS) VALUES (?,?,?,?,?,?,?,?,?)',
        [CREATOR_ID, GUILD_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS],
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

  static updateDetail(TASK_ID, NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER) {
    const initiationTime = new Date(INITIATION_TIME);
    const currentDate = new Date();
    let STATUS = 'Established';
    if (currentDate.toLocaleDateString() === initiationTime.toLocaleDateString()) {
      STATUS = 'In Progress';
    }
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET NAME = ?, INITIATION_TIME = ?, DEADLINE = ?, DESCRIPTION = ?, TYPE = ?, MAX_ADVENTURER = ?, STATUS = ? WHERE ID = ?',
        [NAME, INITIATION_TIME, DEADLINE, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS, TASK_ID],
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

  static updateStatus(TASK_ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = ?, ADVENTURER = 0 WHERE ID = ?`,
        [STATUS, TASK_ID],
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

  static accept(TASK_ID, ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET ADVENTURER = ? WHERE ID = ?',
        [ADVENTURER, TASK_ID],
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

  static maxAccepted(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET ACCEPTED = 'Max Accepted' WHERE ID = ?`,
        [TASK_ID],
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

  static delete(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET ACTIVE = FALSE WHERE ID = ?',
        [TASK_ID],
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

  static checkInitiationTimeEvent() {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = 'In Progress' WHERE INITIATION_TIME < CURRENT_TIMESTAMP AND STATUS = 'Established' AND ACTIVE = TRUE`,
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

  static checkDeadlineEvent() {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = 'Expired' WHERE DEADLINE < CURRENT_TIMESTAMP AND STATUS = 'In Progress' AND ACTIVE = TRUE`,
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

module.exports = TaskModel;
