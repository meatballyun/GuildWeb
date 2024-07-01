import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { TaskModel } from '../../models/guild/task';
import { AdventurerModel } from '../../models/guild/adventurer';
import { TaskService } from '../../services/guild/task';
import { Task } from '../../types/guild/task';
import { Membership } from '../../types/user/userGuildRelation';

export class TaskController {
  static async getUserTasks(req: TypedRequest, res: Response, next: NextFunction) {
    const query = await AdventurerModel.getAllByUser(req.session.passport.user);
    let data: Task[] = [];
    if (query?.length) {
      await Promise.all(
        query.map(async (i) => {
          const tasks = await TaskModel.getOne(i.TASK_ID);
          if (tasks?.length) {
            const task = await Promise.all(
              tasks
                .filter((row: Task) => {
                  return row.STATUS === 'Established' || row.STATUS === 'In Progress';
                })
                .map(async (row: Task) => {
                  return {
                    id: row.ID,
                    gid: row.GUILD_ID,
                    creator: row.CREATOR_ID,
                    name: row.NAME,
                    type: row.TYPE,
                    status: row.STATUS,
                    accepted: row.ACCEPTED,
                  };
                })
            );
            data.push(...task);
          }
        })
      );
    }
    return res.status(200).json({ data });
  }

  static async getTasks(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskService.getAll(req.params, req.query, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getTaskDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskService.getOne(req.params, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async acceptTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.accept(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async abandonTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.abandon(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async addTask(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskService.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async completeTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.complete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async failTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.fail(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateTask(req: TypedRequest, res: Response, next: NextFunction) {
    // prettier-ignore
    const data = await TaskService.update( req.body, req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async cancelTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.cancel(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async restoreTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.restore(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async submitTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.submit(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async clickCheckboxForItemRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.clickCheckboxForItemRecord(req.body.itemRecordId);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskService.delete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
