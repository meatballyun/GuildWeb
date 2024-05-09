const connection = require('../../lib/db');
const { convertKeysToCamelCase } = require('../../utils/convertToCamelCase.js');

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
            if (rows.length === 0) resolve(false);
            else {
              const task = convertKeysToCamelCase(rows[0]);
              resolve(task);
            }
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
            if (rows.length === 0) resolve(false);
            else {
              const tasks = rows.map(convertKeysToCamelCase);
              resolve(tasks);
            }
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
            if (rows.length === 0) resolve(false);
            else {
              const tasks = rows.map(convertKeysToCamelCase);
              resolve(tasks);
            }
          }
        }
      );
    });
  }

  static create(
    CREATOR_ID,
    GUILD_ID,
    { initiationTime, deadline },
    { name, description, type, maxAdventurer }
  ) {
    const currentTime = new Date().getTime();
    let STATUS = 'Established';
    if (currentTime >= new Date(initiationTime).getTime()) {
      STATUS = 'In Progress';
    }
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO tasks(CREATOR_ID, GUILD_ID, INITIATION_TIME, DEADLINE, NAME, DESCRIPTION, TYPE, MAX_ADVENTURER, STATUS) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          CREATOR_ID,
          GUILD_ID,
          initiationTime,
          deadline,
          name,
          description,
          type,
          maxAdventurer,
          STATUS,
        ],
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

  static updateDetail(
    TASK_ID,
    { initiationTime, deadline },
    { name, description, type, maxAdventurer }
  ) {
    const currentTime = new Date().getTime();
    let STATUS = 'Established';
    if (currentTime >= new Date(initiationTime).getTime()) {
      STATUS = 'In Progress';
    }
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET INITIATION_TIME = ?, DEADLINE = ?, NAME = ?, DESCRIPTION = ?, TYPE = ?, MAX_ADVENTURER = ?, STATUS = ? WHERE ID = ?',
        [initiationTime, deadline, name, description, type, maxAdventurer, STATUS, TASK_ID],
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

  static updateStatus(TASK_ID, STATUS) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = ?, ADVENTURER = 0 WHERE ID = ?`,
        [STATUS, TASK_ID],
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

  static accept(TASK_ID, ADVENTURER) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET ADVENTURER = ? WHERE ID = ?',
        [ADVENTURER, TASK_ID],
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

  static maxAccepted(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET ACCEPTED = 'Max Accepted' WHERE ID = ?`,
        [TASK_ID],
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

  static delete(TASK_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE tasks SET ACTIVE = FALSE WHERE ID = ?',
        [TASK_ID],
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

  static checkInitiationTimeEvent() {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = 'In Progress' WHERE INITIATION_TIME < CURRENT_TIMESTAMP AND STATUS = 'Established' AND ACTIVE = TRUE`,
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

  static checkDeadlineEvent() {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE tasks SET STATUS = 'Expired' WHERE DEADLINE < CURRENT_TIMESTAMP AND STATUS = 'In Progress' AND ACTIVE = TRUE`,
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

module.exports = TaskModel;
