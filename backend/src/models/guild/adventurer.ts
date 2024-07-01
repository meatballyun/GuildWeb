import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, Adventurer } from '../../types/guild/adventurer';

export class AdventurerModel {
  static getOne(taskId: number, userId: number): Promise<Adventurer | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Adventurer[]>(`SELECT * FROM adventurers WHERE taskId = ? AND userId = ?`, [taskId, userId], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByTask(taskId: number): Promise<Adventurer[]> {
    return new Promise((resolve, reject) => {
      conn.query<Adventurer[]>(`SELECT * FROM adventurers WHERE taskId = ?`, [taskId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByUser(userId: number): Promise<Adventurer[]> {
    return new Promise((resolve, reject) => {
      conn.query<Adventurer[]>(`SELECT * FROM adventurers WHERE userId = ?`, [userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(taskId: number, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`INSERT INTO adventurers(taskId , userId, acceptanceTime, status) VALUES (?, ?, CURDATE(), 'Accepted')`, [taskId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(taskId: number, userId: number, status: Status, completedTime: Date): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE adventurers SET status = ?, completedTime = ? WHERE taskId = ? AND userId = ?`, [status, completedTime, taskId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updateStatus(taskId: number, userId: number, status: Status): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE adventurers SET status = ? WHERE taskId = ? AND userId = ?`, [status, taskId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByTask(taskId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`DELETE FROM adventurers WHERE taskId = ?`, [taskId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByTaskAndUser(taskId: number, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`DELETE FROM adventurers WHERE taskId = ? AND userId = ?`, [taskId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
