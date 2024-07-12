import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Category, DietRecipe } from '../../types/food/DietRecipe';

export const getOne = async (id: number): Promise<DietRecipe | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE id = ? AND active = TRUE', [id], function (err, rows) {
      if (err) reject(err);
      resolve(rows?.[0]);
    });
  });
};

export const getAllByDate = async (creatorId: number, dietDate: Date): Promise<DietRecipe[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE creatorId = ? AND dietDate = ? AND active = TRUE', [creatorId, dietDate], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getAllRecipeByDate = async (creatorId: number, dietDate: Date): Promise<DietRecipe[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<DietRecipe[]>(
      `SELECT dr.id, dr.amount, dr.category, r.id AS recipeId, r.name, r.carbs, r.pro, r.fats, r.kcal, r.unit, r.imageUrl
      FROM dietRecords dr
      LEFT JOIN recipes r ON r.id = dr.recipeId 
      WHERE dr.creatorId = ?
        AND dr.dietDate = ?
        AND r.active = TRUE
        AND dr.active = TRUE;`,
      [creatorId, dietDate],
      function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

export const getAllByRecipe = async (creatorId: number, recipeId: number): Promise<DietRecipe[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<DietRecipe[]>('SELECT * FROM dietRecords WHERE creatorId = ? AND recipeId = ? AND active = TRUE', [creatorId, recipeId], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const create = async (creatorId: number, dietDate: Date, category: Category, recipeId: number, amount: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('INSERT INTO dietRecords(creatorId, dietDate, category, recipeId, amount) VALUES (?,?,?,?,?)', [creatorId, dietDate, category, recipeId, amount], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const remove = async (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('UPDATE dietRecords SET active = FALSE WHERE id = ?', [id], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};
