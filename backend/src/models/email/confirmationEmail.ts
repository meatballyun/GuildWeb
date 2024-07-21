import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { Status, EmailType, ConfirmationEmail } from '../../types/email/email';

export class ConfirmationEmailModel {
  static getLatestByUser(userId: number, type: EmailType): Promise<ConfirmationEmail | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<ConfirmationEmail[]>('SELECT * FROM confirmationEmails WHERE userId = ? AND type = ? ORDER BY createTime DESC  LIMIT 1', [userId, type], function (err, rows) {
        if (err) reject(err);
        resolve(rows?.[0]);
      });
    });
  }

  static create(userId: number, type: EmailType, code: string): Promise<ResultSetHeader> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO confirmationEmails(userId, type, code) VALUES (?,?,?)', [userId, type, code], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static update(userId: number, status: Status, type: EmailType): Promise<ResultSetHeader> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE confirmationEmails SET status = ? WHERE userId = ? AND type = ?', [status, userId, type], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}
