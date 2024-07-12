import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { BaseRecipeIngredientRelation, RecipeIngredientRelation } from '../../types/food/RecipeIngredientRelation';

export const getAllByIngredient = async (ingredientId: number): Promise<RecipeIngredientRelation[] | undefined> => {
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
};

export const getAllByRecipe = async (recipeId: number): Promise<RecipeIngredientRelation[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<RecipeIngredientRelation[]>('SELECT * FROM recipeIngredientRelations WHERE recipeId = ? AND amount > 0', recipeId, function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getOne = async (ingredientId: number, recipeId: number): Promise<RecipeIngredientRelation | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<RecipeIngredientRelation[]>('SELECT * FROM recipeIngredientRelations WHERE ingredientId = ? AND recipeId = ?', [ingredientId, recipeId], function (err, rows) {
      if (err) reject(err);
      resolve(rows?.[0]);
    });
  });
};

export const create = async (ingredientId: number, recipeId: number, amount: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('INSERT INTO recipeIngredientRelations(ingredientId, recipeId, amount) VALUES (?,?,?)', [ingredientId, recipeId, amount], function (err, rows) {
      if (err) reject(err);
      resolve(rows.insertId);
    });
  });
};

export const createMany = async (relations: BaseRecipeIngredientRelation[]): Promise<number> => {
  return new Promise((resolve, reject) => {
    const placeholders = new Array(relations.length).fill('(?,?,?)').join(', ');
    const values = relations.reduce(
      (acc, { ingredientId, recipeId, amount }) => {
        acc.push(ingredientId, recipeId, amount);
        return acc;
      },
      [] as (number | string)[]
    );
    conn.query<ResultSetHeader>(`INSERT INTO recipeIngredientRelations(ingredientId, recipeId, amount) VALUES ${placeholders}`, values, function (err, rows) {
      if (err) reject(err);
      resolve(rows?.insertId);
    });
  });
};

export const update = async (ingredientId: number, recipeId: number, amount: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('UPDATE recipeIngredientRelations SET amount = ? WHERE ingredientId = ? AND recipeId = ?', [amount, ingredientId, recipeId], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const updateMany = async (recipeId: number, ingredients: { ingredientId: number; amount: number }[]): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const placeholders = new Array(ingredients.length).fill('WHEN ingredientId = ? THEN ?').join(' ');
    const values = ingredients.reduce(
      (acc, { ingredientId, amount }) => {
        acc.push(ingredientId, amount);
        return acc;
      },
      [] as (number | string)[]
    );
    values.push(recipeId);
    conn.query<ResultSetHeader>(`UPDATE recipeIngredientRelations SET amount = CASE ${placeholders} ELSE amount END WHERE recipeId = ?;`, values, function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const deleteByIngredientAndRecipe = async (ingredientId: number, recipeId: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('DELETE FROM recipeIngredientRelations WHERE ingredientId = ? AND recipeId = ?', [ingredientId, recipeId], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const deleteManyByIngredientAndRecipe = async (recipeId: number, ingredientIds: number[]): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    const placeholders = new Array(ingredientIds.length).fill('(?)').join(', ');
    const values = [recipeId, ...ingredientIds];
    conn.query<ResultSetHeader>(`DELETE FROM recipeIngredientRelations WHERE recipeId = ? AND ingredientId  IN (${placeholders})`, values, function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const deleteByRecipe = async (recipeId: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('DELETE FROM recipeIngredientRelations WHERE recipeId = ?', recipeId, function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};
