import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { BaseRecipe, Recipe } from '../../types/food/Recipe';

export const getOne = async (id: number): Promise<Recipe | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Recipe[]>('SELECT * FROM recipes WHERE id = ?', id, function (err, rows) {
      if (err) reject(err);
      resolve(rows?.[0]);
    });
  });
};

export const getAllByUserAndName = async (creatorId: number, name: string): Promise<Recipe[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Recipe[]>('SELECT * FROM recipes WHERE creatorId = ? AND name LIKE ? AND active = TRUE', [creatorId, '%' + name + '%'], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getAllByName = async (name: string): Promise<Recipe[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Recipe[]>('SELECT * FROM recipes WHERE name LIKE ? AND active = TRUE', ['%' + name + '%'], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const create = async ({ name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseRecipe, creatorId: number): Promise<number> => {
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
};

export const isPublished = async (id: number, published: boolean): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>(`UPDATE recipes SET published = ? WHERE id = ?;`, [published, id], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const update = async (id: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseRecipe): Promise<number> => {
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
};

export const updateNutrition = async (id: number, carbs: number, pro: number, fats: number, kcal: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('UPDATE recipes SET carbs = ?, pro = ?, fats = ?, kcal = ? WHERE id = ?', [carbs, pro, fats, kcal, id], function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const remove = async (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('UPDATE recipes SET active = FALSE WHERE id = ?', id, function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};

export const getPublishedByIngredient = async (ingredientId: number): Promise<Recipe[]> => {
  return new Promise((resolve, reject) => {
    conn.query<Recipe[]>(
      `SELECT r.id, r.published, i.id, i.published
        FROM recipes r
        LEFT JOIN recipeIngredientRelations rir ON rir.recipeId = r.id
        INNER JOIN ingredients i ON i.id = rir.ingredientId
        WHERE i.id = ? AND r.published = true;`,
      [ingredientId],
      function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

export const updateByIngredient = async (ingredientId: number, carbs: number, pro: number, fats: number, kcal: number): Promise<Recipe[]> => {
  return new Promise((resolve, reject) => {
    conn.query<Recipe[]>(
      `UPDATE recipes r
        JOIN recipeIngredientRelations rir ON rir.recipeId = r.id
        JOIN ingredients i ON i.id = rir.ingredientId
        SET r.carbs = r.carbs + (rir.amount * ?),
        r.pro = r.pro + (rir.amount * ?),
        r.fats = r.fats + (rir.amount * ?),
        r.kcal = r.kcal + (rir.amount * ?)
        WHERE i.id = ?;`,
      [carbs, pro, fats, kcal, ingredientId],
      function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};
