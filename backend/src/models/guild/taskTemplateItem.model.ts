import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { TemplateItem } from '../../types/guild/taskTemplateItem';

export class TaskTemplateItemModel {
  static getAll(templateId: number): Promise<TemplateItem[]> {
    return new Promise((resolve, reject) => {
      conn.query<TemplateItem[]>('SELECT * FROM templateItems WHERE templateId = ? AND active = TRUE', [templateId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(templateId: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('INSERT INTO templateItems(templateId , content) VALUES (?,?)', [templateId, content], function (err, rows) {
        if (err) reject(err);
        resolve(rows.insertId);
      });
    });
  }

  static update(id: number, content: string): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE templateItems SET content = ? WHERE id = ?', [content, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE templateItems SET active = FALSE WHERE id  = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByTaskTemplate(templateId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE templateItems SET active = FALSE WHERE templateId  = ?', [templateId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
