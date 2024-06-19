import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface RecipeIngredientRelation extends RowDataPacket {
  ingredientId: number;
  recipeId: number;
  amount: number;
}

export class RecipeIngredientRelationModel {
  static getAllByIngredient(ingredientId: number): Promise<RecipeIngredientRelation[]> {
    return new Promise((resolve, reject) => {
      conn.query<RecipeIngredientRelation[]>(
        'SELECT * FROM recipeIngredientRelations WHERE ingredientId = ? AND recipeId IN (SELECT id FROM recipes WHERE ACTIVE = TRUE)',
        ingredientId,
        function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static getAllByRecipe(recipeId: number): Promise<RecipeIngredientRelation[]> {
    return new Promise((resolve, reject) => {
      conn.query<RecipeIngredientRelation[]>('SELECT * FROM recipeIngredientRelations WHERE recipeId = ? AND amount > 0', recipeId, function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getOne(ingredientId: number, recipeId: number): Promise<RecipeIngredientRelation | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<RecipeIngredientRelation[]>('SELECT * FROM recipeIngredientRelations WHERE ingredientId = ? AND recipeId = ?', [ingredientId, recipeId], function (err, rows) {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static create(ingredientId: number, recipeId: number, amount: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO recipeIngredientRelations(ingredientId, recipeId, amount) VALUES (?,?,?)', [ingredientId, recipeId, amount], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(ingredientId: number, recipeId: number, amount: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE recipeIngredientRelations SET amount = ? WHERE ingredientId = ? AND recipeId = ?', [amount, ingredientId, recipeId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByIngredientAndRecipe(ingredientId: number, recipeId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('DELETE FROM recipeIngredientRelations WHERE ingredientId = ? AND recipeId = ?', [ingredientId, recipeId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByRecipe(recipeId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('DELETE FROM recipeIngredientRelations WHERE recipeId = ?', recipeId, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
