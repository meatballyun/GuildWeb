import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, Adventurer } from '../../types/guild/adventurer';

export class AdventurerModel {
  static getOne(missionId: number, userId: number): Promise<Adventurer | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Adventurer[]>(`SELECT * FROM adventurers WHERE missionId = ? AND userId = ?`, [missionId, userId], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByMission(missionId: number): Promise<Adventurer[]> {
    return new Promise((resolve, reject) => {
      conn.query<Adventurer[]>(`SELECT * FROM adventurers WHERE missionId = ?`, [missionId], function (err, rows) {
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

  static create(missionId: number, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`INSERT INTO adventurers(missionId , userId, acceptanceTime, status) VALUES (?, ?, CURDATE(), 'Accepted')`, [missionId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(missionId: number, userId: number, status: Status, completedTime: Date): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE adventurers SET status = ?, completedTime = ? WHERE missionId = ? AND userId = ?`, [status, completedTime, missionId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updateStatus(missionId: number, userId: number, status: Status): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE adventurers SET status = ? WHERE missionId = ? AND userId = ?`, [status, missionId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByMission(missionId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`DELETE FROM adventurers WHERE missionId = ?`, [missionId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByMissionAndUser(missionId: number, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`DELETE FROM adventurers WHERE missionId = ? AND userId = ?`, [missionId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
