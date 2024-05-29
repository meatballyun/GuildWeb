import conn from '../../lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

type TaskType = 'emergency' | 'daily' | 'weekly' | 'monthly' | 'ordinary';
type Status = 'established' | 'in progress' | 'completed' | 'expired' | 'cancelled';
type Accepted = 'pending acceptance' | 'max accepted';

interface TaskTime {
  initiationTime: Date;
  deadline: Date;
}

interface TaskInfo {
  name: string;
  type: TaskType;
  status?: Status;
  description: string;
  maxAdventurer: number;
  adventurer?: number;
  accepted?: Accepted;
}

interface Task extends TaskTime, TaskInfo, RowDataPacket {
  id: number;
  creatorId: number;
  guildId: number;
  templateId?: number;
  createTime?: Date;
  updateTime?: Date;
  active: boolean;
}

class TaskModel {
  static getOne(id: number): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      conn.query<Task[]>('SELECT * FROM tasks WHERE id = ? AND active = TRUE', [id], function (err, rows) {
        if (err) reject(err);
        if (rows?.length) resolve(rows[0]);
        resolve(undefined);
      });
    });
  }

  static getAllByGuild(guildId: number): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      conn.query<Task[]>('SELECT * FROM tasks WHERE guildId = ? AND active = TRUE', [guildId], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static getAllByGuildAndName(guildId: number, name: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      conn.query<Task[]>('SELECT * FROM tasks WHERE guildId = ? AND name LIKE ? AND active = TRUE', [guildId, '%' + name + '%'], function (err, rows) {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static create(creatorId: number, guildId: number, { initiationTime, deadline }: TaskTime, { name, description, type, maxAdventurer }: TaskInfo): Promise<number> {
    const currentTime = new Date().getTime();
    const status = currentTime >= new Date(initiationTime).getTime() ? 'In Progress' : 'Established';
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'INSERT INTO tasks(creatorId , guildId, initiationTime, deadline, name, description, type, maxAdventurer, status) VALUES (?,?,?,?,?,?,?,?,?)',
        [creatorId, guildId, initiationTime, deadline, name, description, type, maxAdventurer, status],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.insertId);
        }
      );
    });
  }

  static updateDetail(id: number, { initiationTime, deadline }: TaskTime, { name, description, type, maxAdventurer }: TaskInfo): Promise<number> {
    const currentTime = new Date().getTime();
    const status = currentTime >= new Date(initiationTime).getTime() ? 'In Progress' : 'Established';
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(
        'UPDATE tasks SET initiationTime = ?, deadline = ?, name = ?, description = ?, type = ?, maxAdventurer = ?, status = ? WHERE id = ?',
        [initiationTime, deadline, name, description, type, maxAdventurer, status, id],
        function (err, rows) {
          if (err) reject(err);
          resolve(rows.affectedRows);
        }
      );
    });
  }

  static updateStatus(id: number, status: Status): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE tasks SET status = ?, adventurer  = 0 WHERE id = ?`, [status, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static accept(id: number, adventurer: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE tasks SET adventurer  = ? WHERE id = ?', [adventurer, id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static maxAccepted(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE tasks SET ACCEPTED = 'max accepted' WHERE id = ?`, [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>('UPDATE tasks SET active = FALSE WHERE id = ?', [id], function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static checkInitiationTimeEvent(): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE tasks SET status = 'in progress' WHERE initiationTime < CURRENT_TIMESTAMP AND status = 'established' AND active = TRUE`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }

  static checkDeadlineEvent(): Promise<number> {
    return new Promise((resolve, reject) => {
      conn.query<ResultSetHeader>(`UPDATE tasks SET status = 'expired' WHERE deadline < CURRENT_TIMESTAMP AND status = 'in progress' AND active = TRUE`, function (err, rows) {
        if (err) reject(err);
        resolve(rows.affectedRows);
      });
    });
  }
}

export default TaskModel;
