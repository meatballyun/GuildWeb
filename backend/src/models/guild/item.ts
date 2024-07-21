import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Item } from '../../types/guild/item';

export class ItemModel {
  static getAll(missionId: number): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      conn.query<Item[]>('SELECT * FROM items WHERE missionId = ? AND active = TRUE', [missionId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByManyMissions(missionIds: number[]): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (missionIds.length === 0) {
        return;
      }
      const placeholders = missionIds.join(',');
      conn.query<Item[]>(`SELECT * FROM items WHERE missionId IN (${placeholders}) AND active = TRUE`, function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(missionId: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO items(missionId , content) VALUES (?,?)', [missionId, content], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static createMany(missionId: number, contents: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (contents.length === 0) return;
      const placeholders = new Array(contents.length).fill('(?,?)').join(', ');
      const values = contents.reduce(
        (acc, content) => {
          acc.push(missionId, content);
          return acc;
        },
        [] as (number | string)[]
      );
      conn.query<ResultSetHeader>(`INSERT INTO items(missionId , content) VALUES ${placeholders}`, values, function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(id: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE items SET content = ? WHERE id = ?', [content, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updateMany(items: { id: number; content: string }[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!items.length) return;
      const cases = items.map(({ id }) => `WHEN id = ${id} THEN ?`).join(' ');
      const values = items.map(({ content }) => content);
      const ids = items.map(({ id }) => id).join(', ');
      conn.query<ResultSetHeader>(
        ` UPDATE items
          SET content = CASE ${cases} END
          WHERE id IN (${ids});`,
        values,
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE items SET active = FALSE WHERE id = ?', [id], function (err, rows) {
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
      conn.query<ResultSetHeader>(`UPDATE items SET active = FALSE WHERE id IN(${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAll(missionId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE items SET active = FALSE WHERE missionId = ?', [missionId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByManyMissions(missionId: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (missionId.length === 0) {
        return;
      }
      const placeholders = missionId.join(',');
      conn.query<ResultSetHeader>(`UPDATE items SET active = FALSE WHERE missionId IN (${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
