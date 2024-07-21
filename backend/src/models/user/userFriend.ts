import connection from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, UserFriend } from '../../types/user/userFriend';

export class UserFriendModel {
  static getStatus(user1Id: number, user2Id: number): Promise<Status | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserFriend[]>(`SELECT status FROM userFriends WHERE user1Id = ? AND user2Id = ?`, [user1Id, user2Id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0].status);
        resolve(undefined);
      });
    });
  }

  static getAllByIdAndName(userId: number, name: string): Promise<UserFriend[] | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserFriend[]>(
        `SELECT u.id, u.name, u.imageUrl, u.rank FROM users u INNER JOIN userFriends uf ON (u.id = uf.user1Id OR u.id = uf.user2Id) WHERE uf.status = 'confirmed' AND (uf.user1Id = ? OR uf.user2Id = ?) AND u.name LIKE ?`,
        [userId, userId, '%' + name + '%'],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static create(user1Id: number, user2Id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('INSERT INTO userFriends (user1Id, user2Id) VALUES (?,?)', [user1Id, user2Id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static update(user1Id: number, user2Id: number, status: Status): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE userFriends SET status = ? WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)',
        [status, user1Id, user2Id, user2Id, user1Id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static delete(user1Id: number, user2Id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM userFriends WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)', [user1Id, user2Id, user2Id, user1Id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
