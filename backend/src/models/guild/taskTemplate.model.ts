// @ts-nocheck
import connection from '../../lib/db';
import { convertKeysToCamelCase } from '../../utils/convertToCamelCase';

class TaskTemplateModel {
  static DATE_ADD(CURRENT, INTERVAL, UNIT) {
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

  static getOne(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM taskTemplates WHERE ID = ? AND ACTIVE = TRUE',
        [ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              if (rows.length === 0) resolve(false);
              const taskTemplates = convertKeysToCamelCase(rows[0]);
              resolve(taskTemplates);
            }
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM taskTemplates WHERE ENABLED = TRUE AND ACTIVE = TRUE',
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const taskTemplates = rows.map(convertKeysToCamelCase);
              resolve(taskTemplates);
            }
          }
        }
      );
    });
  }

  static getAllByGuild(GUILD_ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM taskTemplates WHERE GUILD_ID = ? AND ACTIVE = TRUE',
        [GUILD_ID],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const taskTemplates = rows.map(convertKeysToCamelCase);
              resolve(taskTemplates);
            }
          }
        }
      );
    });
  }

  static getAllByGuildAndName(GUILD_ID, NAME) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM taskTemplates WHERE GUILD_ID = ? AND NAME LIKE ? AND ACTIVE = TRUE',
        [GUILD_ID, '%' + NAME + '%'],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) resolve(false);
            else {
              const taskTemplates = rows.map(convertKeysToCamelCase);
              resolve(taskTemplates);
            }
          }
        }
      );
    });
  }

  static create(
    CREATOR_ID,
    GUILD_ID,
    { generationTime, deadline },
    { name, description, type, maxAdventurer }
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO taskTemplates(CREATOR_ID, GUILD_ID,  GENERATION_TIME, DEADLINE, NAME, DESCRIPTION, TYPE, MAX_ADVENTURER) VALUES (?,?,?,?,?,?,?,?)',
        [CREATOR_ID, GUILD_ID, generationTime, deadline, name, description, type, maxAdventurer],
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

  static update(
    ID,
    { generationTime, deadline },
    { enabled, name, description, type, maxAdventurer }
  ) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE taskTemplates SET  ENABLED = ?, NAME = ?, DESCRIPTION = ?,  GENERATION_TIME = ?, DEADLINE = ?, TYPE = ?, MAX_ADVENTURER = ? WHERE ID = ?',
        [enabled, name, description, generationTime, deadline, type, maxAdventurer, ID],
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

  static updateTime(ID, GENERATION_TIME, DEADLINE) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE taskTemplates SET GENERATION_TIME = ?, DEADLINE = ? WHERE ID = ?',
        [GENERATION_TIME, DEADLINE, ID],
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

  static delete(ID) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE taskTemplates SET ACTIVE = FALSE WHERE ID = ?',
        [ID],
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

export default TaskTemplateModel;
