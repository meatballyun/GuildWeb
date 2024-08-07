import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { ItemRecord } from '../../types/guild/itemRecord';

export class ItemRecordModel {
  static getOne(id: number): Promise<ItemRecord | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<ItemRecord[]>('SELECT * FROM itemRecords WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByItem(itemId: number): Promise<ItemRecord[]> {
    return new Promise((resolve, reject) => {
      conn.query<ItemRecord[]>('SELECT * FROM itemRecords WHERE itemId = ? AND active = TRUE', [itemId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByItemAndUser(itemId: number, userId: number): Promise<ItemRecord[]> {
    return new Promise((resolve, reject) => {
      conn.query<ItemRecord[]>('SELECT * FROM itemRecords WHERE itemId = ? AND userId = ? AND active = TRUE', [itemId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByManyItemAndUser(itemIds: number[], userId: number): Promise<ItemRecord[]> {
    return new Promise((resolve, reject) => {
      if (itemIds.length === 0) {
        return;
      }
      const placeholders = itemIds.join(',');
      conn.query<ItemRecord[]>(`SELECT * FROM itemRecords WHERE itemId IN (${placeholders}) AND userId = ? AND active = TRUE`, [userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(itemId: number, content: string, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO itemRecords(itemId , content, userId) VALUES (?,?,?)', [itemId, content, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static createMany(itemIds: number[], AdventurerId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      if (itemIds.length === 0) {
        return;
      }
      const placeholders = itemIds.join(',');
      conn.query<ResultSetHeader>(
        `
        INSERT INTO itemRecords (itemId, content, userId)
        SELECT id, content, ?
        FROM items
        WHERE id in (${placeholders});`,
        [AdventurerId],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static update(id: number, status: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE itemRecords SET status = ? WHERE id = ?', [status, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteOne(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE itemRecords SET active = FALSE WHERE id =?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByItem(itemId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE itemRecords SET active = FALSE WHERE itemId =?', [itemId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByManyItems(itemIds: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (itemIds.length === 0) {
        return;
      }
      const placeholders = itemIds.join(',');
      conn.query<ResultSetHeader>(`UPDATE itemRecords SET active = FALSE WHERE itemId IN (${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByItemAndUser(itemId: number, userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE itemRecords SET active = FALSE WHERE itemId = ? AND userId = ?', [itemId, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteAllByManyItemAndUser(itemIds: number[], userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE itemRecords SET active = FALSE WHERE itemId IN (?) AND userId = ?', [itemIds, userId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
