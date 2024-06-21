import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Category, DietRecipe } from '../../types/food/DietRecipe';

export class DietRecordModel {
  static getOne(id: number): Promise<DietRecipe | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static getAllByDate(creatorId: number, dietDate: Date): Promise<DietRecipe[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE creatorId = ? AND dietDate = ? AND active = TRUE', [creatorId, dietDate], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByRecipe(creatorId: number, recipeId: number): Promise<DietRecipe[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE creatorId = ? AND recipeId = ? AND active = TRUE', [creatorId, recipeId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(creatorId: number, dietDate: Date, category: Category, recipeId: number, amount: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO dietRecords(creatorId, dietDate, category, recipeId, amount) VALUES (?,?,?,?,?)',
        [creatorId, dietDate, category, recipeId, amount],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE dietRecords SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
