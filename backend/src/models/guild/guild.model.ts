import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface BaseGuild {
  leaderId: number;
  name: string;
  description?: string;
  imageUrl: string;
  cabin?: boolean;
  published?: boolean;
}

interface Guild extends BaseGuild, RowDataPacket {
  id: number;
  createTime: Date;
  updateTime: Date;
  active: boolean;
}

class GuildModel {
  static getOne(id: number): Promise<Guild | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Guild[]>('SELECT * FROM guilds WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static create(leaderId: number, { name, description, imageUrl }: BaseGuild): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO guilds(leaderId, name, description, imageUrl, cabin) VALUES (?,?,?,?,?)', [leaderId, name, description, imageUrl, false], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static addCabin(leaderId: number, name: string, description: string, imageUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO guilds(leaderId, name, description, imageUrl, cabin) VALUES (?,?,?,?,?)', [leaderId, name, description, imageUrl, true], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(id: number, { name, description, imageUrl }: BaseGuild): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE guilds SET name = ? , description = ?, imageUrl = ? WHERE id = ?', [name, description, imageUrl, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteGuild(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE guilds SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}

export default GuildModel;
