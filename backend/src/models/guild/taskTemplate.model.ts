import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { TaskTemplateTime, TaskTemplateInfo, TaskTemplate } from '../../types/guild/taskTemplate';

export class TaskTemplateModel {
  static DATE_ADD(current: Date, interval: Date, unit: string): Promise<string> {
    const query = 'SELECT DATE_ADD(?, interval ? ' + unit + ');';
    return new Promise((resolve, reject) => {
      conn.query<RowDataPacket[]>(query, [current, interval], function (err, rows) {
        if (err) reject(err);
        resolve(rows[0].newDate);
      });
    });
  }

  static getOne(id: number): Promise<TaskTemplate | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<TaskTemplate[]>('SELECT * FROM taskTemplates WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAll(): Promise<TaskTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<TaskTemplate[]>('SELECT * FROM taskTemplates WHERE enabled = TRUE AND active = TRUE', function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuild(guildId: number): Promise<TaskTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<TaskTemplate[]>('SELECT * FROM taskTemplates WHERE guildId = ? AND active = TRUE', [guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuildAndName(guildId: number, name: string): Promise<TaskTemplate[]> {
    return new Promise((resolve, reject) => {
      conn.query<TaskTemplate[]>('SELECT * FROM taskTemplates WHERE guildId = ? AND name LIKE ? AND active = TRUE', [guildId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(
    creatorId: number,
    guildId: number,
    { initiationTime: generationTime, deadline }: { initiationTime: string; deadline: string },
    { name, description, type, maxAdventurer }: TaskTemplateInfo
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO taskTemplates(creatorId, guildId,  generationTime, deadline, name, DESCRIPTION, TYPE, MAX_ADVENTURER) VALUES (?,?,?,?,?,?,?,?)',
        [creatorId, guildId, generationTime, deadline, name, description, type, maxAdventurer],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static update(id: number, { generationTime, deadline }: TaskTemplateTime, { enabled, name, description, type, maxAdventurer }: TaskTemplateInfo): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE taskTemplates SET  enabled = ?, name = ?, DESCRIPTION = ?,  generationTime = ?, deadline = ?, TYPE = ?, MAX_ADVENTURER = ? WHERE id = ?',
        [enabled, name, description, generationTime, deadline, type, maxAdventurer, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static updateTime(id: number, generationTime: Date, deadline: Date): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE taskTemplates SET generationTime = ?, deadline = ? WHERE id = ?', [generationTime, deadline, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE taskTemplates SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
