import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, BaseUser, User } from '../../types/user/user';

export class UserModel {
  static getOneById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<User[]>(`SELECT * FROM users WHERE id = ? AND status = 'confirmed'`, id, function (err, rows) {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static getOneByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<User[]>('SELECT * FROM users WHERE email = ?', email, function (err, rows) {
        if (err) reject(err);
        if (rows.length === 0) resolve(undefined);
        resolve(rows?.[0]);
      });
    });
  }

  static getAllByName(name: string): Promise<User[] | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<User[]>(`SELECT * FROM users WHERE name LIKE ? AND status = 'confirmed'`, ['%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(name: string, email: string, password: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO users(name, email, password) VALUES (?,?,?)', [name, email, password], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static updateStatus(status: Status, id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE users SET status = ? WHERE id = ?', [status, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updatePassword(id: number, password: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE users SET password = ? WHERE id = ?', [password, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updateInfo(id: number, { name, imageUrl, carbs, pro, fats, kcal }: BaseUser): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE users SET name =?, imageUrl = ?, carbs = ?, pro = ?, fats = ?, kcal = ? WHERE id = ?', [name, imageUrl, carbs, pro, fats, kcal, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static updateExp(id: number, exp: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE users SET exp = ? WHERE id = ?', [exp, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static upgrade(id: number, rank: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE users SET `rank` = ? WHERE id = ?', [rank, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
