import conn from '../../lib/db';
import { ResultSetHeader } from 'mysql2';
import { TemplateItem } from '../../types/guild/missionTemplateItem';

export class MissionTemplateItemModel {
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

  static createMany(templateId: number, contents: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!contents?.length) return;
      const placeholders = new Array(contents.length).fill('(?,?)').join(', ');
      const values = contents.reduce(
        (acc, content) => {
          acc.push(templateId, content);
          return acc;
        },
        [] as (number | string)[]
      );
      conn.query<ResultSetHeader>(`INSERT INTO templateItems(templateId , content) VALUES ${placeholders}`, values, function (err, rows) {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(rows);
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

  static updateMany(templateItems: { id: number; content: string }[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!templateItems.length) return 0;

      const cases = templateItems.map((templateItem) => `WHEN id = ${templateItem.id} THEN ?`).join(' ');
      const values = templateItems.map((templateItem) => templateItem.content);
      const ids = templateItems.map((templateItem) => templateItem.id).join(', ');

      conn.query<ResultSetHeader>(
        ` UPDATE templateItems
          SET content = CASE ${cases} END
          WHERE id IN (${ids});`,
        values,
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
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

  static deleteManyById(ids: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (ids.length === 0) {
        return;
      }
      const placeholders = ids.join(',');
      conn.query<ResultSetHeader>(`UPDATE templateItems SET active = FALSE WHERE id IN(${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByMissionTemplate(templateId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE templateItems SET active = FALSE WHERE templateId  = ?', [templateId], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static deleteByManyMissionTemplates(templateId: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      if (templateId.length === 0) {
        return;
      }
      const placeholders = templateId.join(',');
      conn.query<ResultSetHeader>(`UPDATE templateItems SET active = FALSE WHERE templateId IN (${placeholders})`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}
