import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { MissionTemplateTime, MissionTemplateInfo, MissionTemplate } from '../../types/guild/missionTemplate';

export class MissionTemplateModel {
  static DATE_ADD(current: string | Date, interval: number, unit: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const query = `SELECT DATE_ADD(?, INTERVAL ? ${unit}) AS resultDate;`;
      conn.query<RowDataPacket[]>(query, [current, interval], (err, rows) => {
        if (err) return reject(err);
        if (rows && rows.length > 0) resolve(rows[0]['resultDate']);
        reject(new Error('No result found'));
      });
    });
  }

  static getOne(id: number): Promise<MissionTemplate | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<MissionTemplate[]>('SELECT * FROM missionTemplates WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAll(): Promise<MissionTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<MissionTemplate[]>('SELECT * FROM missionTemplates WHERE enabled = TRUE AND active = TRUE', function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuild(guildId: number): Promise<MissionTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<MissionTemplate[]>('SELECT * FROM missionTemplates WHERE guildId = ? AND active = TRUE', [guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuildAndName(guildId: number, name: string): Promise<MissionTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<MissionTemplate[]>('SELECT * FROM missionTemplates WHERE guildId = ? AND name LIKE ? AND active = TRUE', [guildId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(
    creatorId: number,
    guildId: number,
    { initiationTime: generationTime, deadline }: { initiationTime: string; deadline: string },
    { name, description, type, maxAdventurer }: MissionTemplateInfo
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO missionTemplates(creatorId, guildId,  generationTime, deadline, name, description, type, maxAdventurer) VALUES (?,?,?,?,?,?,?,?)',
        [creatorId, guildId, generationTime, deadline, name, description, type, maxAdventurer],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static update(id: number, { generationTime, deadline }: MissionTemplateTime, { enabled, name, description, type, maxAdventurer }: MissionTemplateInfo): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE missionTemplates SET  enabled = ?, name = ?, description = ?,  generationTime = ?, deadline = ?, type = ?, maxAdventurer = ? WHERE id = ?',
        [enabled, name, description, generationTime, deadline, type, maxAdventurer, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static updateTime(id: number, generationTime: string, deadline: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE missionTemplates SET generationTime = ?, deadline = ? WHERE id = ?', [generationTime, deadline, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE missionTemplates SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByIds(ids: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (ids.length === 0) {
        return;
      }
      const placeholders = ids.join(',');
      conn.query<ResultSetHeader>(`UPDATE missionTemplates SET active = FALSE WHERE id IN (${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
