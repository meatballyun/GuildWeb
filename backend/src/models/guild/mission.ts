import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, MissionTime, MissionInfo, Mission } from '../../types/guild/mission';
export class MissionModel {
  static getOne(id: number): Promise<Mission | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Mission[]>('SELECT * FROM missions WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByUser(uid: number): Promise<Mission[]> {
    return new Promise((resolve, reject) => {
      conn.query<Mission[]>('SELECT m.* from adventurers a LEFT JOIN missions m ON a.missionId = m.id WHERE userId = ?;', [uid], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuild(guildId: number): Promise<Mission[]> {
    return new Promise((resolve, reject) => {
      conn.query<Mission[]>('SELECT * FROM missions WHERE guildId = ? AND active = TRUE ', [guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuildAndName(guildId: number, name: string): Promise<Mission[]> {
    return new Promise((resolve, reject) => {
      conn.query<Mission[]>('SELECT * FROM missions WHERE guildId = ? AND name LIKE ? AND active = TRUE ORDER BY id ASC', [guildId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(creatorId: number, guildId: number, { initiationTime, deadline }: MissionTime, { name, description, type, maxAdventurer }: MissionInfo): Promise<number> {
    const currentTime = new Date().getTime();
    const status = currentTime >= new Date(initiationTime).getTime() ? 'in progress' : 'established';
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO missions(creatorId , guildId, initiationTime, deadline, name, description, type, maxAdventurer, status) VALUES (?,?,?,?,?,?,?,?,?)',
        [creatorId, guildId, initiationTime, deadline, name, description, type, maxAdventurer, status],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static updateDetail(id: number, { initiationTime, deadline }: MissionTime, { name, description, type, maxAdventurer }: MissionInfo): Promise<number> {
    const currentTime = new Date().getTime();
    const status = currentTime >= new Date(initiationTime).getTime() ? 'in progress' : 'established';
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE missions SET initiationTime = ?, deadline = ?, name = ?, description = ?, type = ?, maxAdventurer = ?, status = ? WHERE id = ?',
        [initiationTime, deadline, name, description, type, maxAdventurer, status, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static updateStatus(id: number, status: Status): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE missions SET status = ?, adventurer  = 0 WHERE id = ?`, [status, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static accept(id: number, adventurer: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE missions SET adventurer  = ? WHERE id = ?', [adventurer, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static maxAccepted(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE missions SET ACCEPTED = 'max accepted' WHERE id = ?`, [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE missions SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteManyById(ids: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (ids.length === 0) {
        return;
      }
      const placeholders = ids.join(',');
      conn.query<ResultSetHeader>(`UPDATE missions SET active = FALSE WHERE id IN (${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static checkInitiationTimeEvent(): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE missions SET status = 'in progress' WHERE initiationTime < CURRENT_TIMESTAMP AND status = 'established' AND active = TRUE`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static checkDeadlineEvent(): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE missions SET status = 'expired' WHERE deadline < CURRENT_TIMESTAMP AND status = 'in progress' AND active = TRUE`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
