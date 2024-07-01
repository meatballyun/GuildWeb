import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Item } from '../../types/guild/item';

export class ItemModel {
  static getAll(taskId: number): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      conn.query<Item[]>('SELECT * FROM items WHERE taskId = ? AND active = TRUE', [taskId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(taskId: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO items(taskId , content) VALUES (?,?)', [taskId, content], function (err, rows) {
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

  static deleteAll(taskId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE items SET active = FALSE WHERE taskId = ?', [taskId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
