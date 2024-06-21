import connection from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Membership, UserGuildRelation } from '../../types/user/userGuildRelation';

class UserGuildRelationModel {
  static getOneByGuildAndUser(userId: number, guildId: number): Promise<UserGuildRelation | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserGuildRelation[]>('SELECT * FROM userGuildRelations WHERE userId = ? AND guildId = ?', [userId, guildId], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByGuild(guildId: number): Promise<UserGuildRelation[] | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserGuildRelation[]>('SELECT * FROM userGuildRelations WHERE guildId = ?', [guildId], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows);
        resolve(undefined);
      });
    });
  }

  static getAllByUser(userId: number): Promise<UserGuildRelation[] | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserGuildRelation[]>(
        'SELECT ugr.* FROM userGuildRelations ugr INNER JOIN guilds g ON ugr.guildId = g.ID WHERE ugr.userId = ? AND g.active=TRUE ',
        [userId],
        function (err, rows) {
          if (err) reject(err);
          if (rows?.length) resolve(rows);
          resolve(undefined);
        }
      );
    });
  }

  static getAllByUserAndName(userId: number, name: string): Promise<UserGuildRelation[] | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<UserGuildRelation[]>(
        'SELECT ugr.guildId FROM userGuildRelations ugr INNER JOIN guilds g ON ugr.guildId = g.ID WHERE ugr.userId = ? AND g.active = TRUE AND g.name LIKE ?',
        [userId, '%' + name + '%'],
        function (err, rows) {
          if (err) reject(err);
          if (rows?.length) resolve(rows);
          resolve(undefined);
        }
      );
    });
  }

  static create(userId: number, guildId: number, membership: Membership): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('INSERT INTO userGuildRelations(userId, guildId, membership) VALUES (?,?,?)', [userId, guildId, membership], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static update(userId: number, guildId: number, membership: Membership): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('UPDATE userGuildRelations SET membership = ? WHERE userId = ? AND guildId = ? ', [membership, userId, guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(userId: number, guildId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>('DELETE FROM userGuildRelations WHERE userId = ? AND guildId = ? ', [userId, guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}

export default UserGuildRelationModel;
