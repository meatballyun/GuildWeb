import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { BaseRecipe, Recipe } from '../../custom/food/Recipe';

export class RecipeModel {
  static getOne(id: number): Promise<Recipe | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Recipe[]>('SELECT * FROM recipes WHERE id = ?', id, function (err, rows) {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static getAllByUserAndName(creatorId: number, name: string): Promise<Recipe[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Recipe[]>('SELECT * FROM recipes WHERE creatorId = ? AND name LIKE ? AND active = TRUE', [creatorId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows);
        resolve(undefined);
      });
    });
  }

  static getAllByName(name: string): Promise<Recipe[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Recipe[]>('SELECT * FROM recipes WHERE name LIKE ? AND active = TRUE', ['%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows);
        resolve(undefined);
      });
    });
  }

  static create({ name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseRecipe, creatorId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO recipes(creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published) VALUES (?,?,?,?,?,?,?,?,?,?)',
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
      conn.query<ResultSetHeader>(`UPDATE recipes SET published = ? WHERE id = ?;`, [published, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static update(id: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseRecipe): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE recipes SET name = ?, description = ?, carbs = ?, pro = ?, fats = ?, kcal = ?, unit = ?, imageUrl = ?, published = ? WHERE id = ?',
        [name, description, carbs, pro, fats, kcal, unit, imageUrl, published, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static updateNutrition(id: number, carbs: number, pro: number, fats: number, kcal: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE recipes SET carbs = ?, pro = ?, fats = ?, kcal = ? WHERE id = ?', [carbs, pro, fats, kcal, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE recipes SET active = FALSE WHERE id = ?', id, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
