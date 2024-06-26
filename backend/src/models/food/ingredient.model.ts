import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { BaseIngredient, Ingredient } from '../../types/food/Ingredient';

export class IngredientModel {
  static getOne(id: number): Promise<Ingredient | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE ID = ? AND active = TRUE', id, (err, rows) => {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static getAllByUserAndName(creatorId: number, name: string): Promise<Ingredient[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE creatorId = ? AND name LIKE ? AND active = TRUE', [creatorId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByName(name: string): Promise<Ingredient[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE name LIKE ? AND active = TRUE AND published = TRUE', ['%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create({ name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseIngredient, creatorId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO ingredients(creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static copy(creatorId: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl }: BaseIngredient, published: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO ingredients(creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static isPublished(id: number, published: boolean): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE ingredients SET published = ? WHERE id = ?;`, [published, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static update(id: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseIngredient): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE ingredients SET name = ?, description = ?, carbs = ?, pro = ?, fats = ?, kcal = ?, unit = ?, imageUrl = ?, published = ? WHERE id = ?',
        [name, description, carbs, pro, fats, kcal, unit, imageUrl, published, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE ingredients SET active = FALSE WHERE id = ?', id, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
