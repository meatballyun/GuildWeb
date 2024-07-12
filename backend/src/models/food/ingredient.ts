import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { BaseIngredient, Ingredient, IngredientWithAmount } from '../../types/food/Ingredient';

export const getOne = async (id: number): Promise<Ingredient | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE id = ? AND active = true', id, (err, rows) => {
      if (err) reject(err);
      resolve(rows?.[0]);
    });
  });
};

export const getAllByUserAndName = async (creatorId: number, name: string): Promise<Ingredient[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE creatorId = ? AND name LIKE ? AND active = true', [creatorId, '%' + name + '%'], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getAllByName = async (name: string): Promise<Ingredient[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<Ingredient[]>('SELECT * FROM ingredients WHERE name LIKE ? AND active = true AND published = true', ['%' + name + '%'], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const getAllByRecipe = async (id: number): Promise<IngredientWithAmount[] | undefined> => {
  return new Promise((resolve, reject) => {
    conn.query<IngredientWithAmount[]>(
      `SELECT rir.amount, i.id, i.carbs, i.pro, i.fats, i.kcal, i.imageUrl, i.published, i.unit, i.creatorId
      FROM recipeIngredientRelations rir
      LEFT JOIN ingredients i ON rir.ingredientId = i.id
      WHERE rir.recipeId = ? AND i.active = true;`,
      id,
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

export const create = async ({ name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseIngredient, creatorId: number): Promise<number> => {
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
};

export const copyMany = async (creatorId: number, ids: number[]): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (ids.length === 0) {
      return;
    }
    const placeholders = ids.join(',');
    conn.query<ResultSetHeader>(
      `INSERT INTO ingredients (creatorId, name, description, carbs, pro, fats, kcal, unit, imageUrl, published)
        SELECT ?, name, description, carbs, pro, fats, kcal, unit, imageUrl, false
        FROM ingredients
        WHERE id IN (${placeholders});`,
      [creatorId],
      function (err, rows) {
        if (err) {
          reject(err);
        }
        resolve(rows?.insertId);
      }
    );
  });
};

export const oldcopy = async (creatorId: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl }: BaseIngredient, published: boolean): Promise<number> => {
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
};

export const isPublished = async (id: number[], published: boolean): Promise<ResultSetHeader> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>(`UPDATE ingredients SET published = ? WHERE id IN (?);`, [published, id], function (err, rows) {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

export const update = async (id: number, { name, description, carbs, pro, fats, kcal, unit, imageUrl, published }: BaseIngredient): Promise<number> => {
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
};

export const remove = async (id: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    conn.query<ResultSetHeader>('UPDATE ingredients SET active = FALSE WHERE id = ?', id, function (err, rows) {
      if (err) reject(err);
      resolve(rows.affectedRows);
    });
  });
};
