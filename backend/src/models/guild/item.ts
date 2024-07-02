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

  static create(missionId: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO items(missionId , content) VALUES (?,?)', [missionId, content], function (err, rows) {
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

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE items SET active = FALSE WHERE id = ?', [id], function (err, rows) {
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
}
