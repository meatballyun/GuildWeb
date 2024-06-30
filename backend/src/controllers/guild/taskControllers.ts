import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { TaskModel } from '../../models/guild/task.model';
import { AdventurerModel } from '../../models/guild/adventurer.model';
import { TaskRepository } from '../../repositories/guild/task.repository';
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
    const data = await TaskRepository.getAll(req.params, req.query, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getTaskDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskRepository.getOne(req.params, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async acceptTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.accept(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async abandonTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.abandon(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async addTask(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskRepository.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async completeTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.complete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async failTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.fail(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateTask(req: TypedRequest, res: Response, next: NextFunction) {
    // prettier-ignore
    const data = await TaskRepository.update( req.body, req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async cancelTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.cancel(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async restoreTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.restore(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async submitTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.submit(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async clickCheckboxForItemRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.clickCheckboxForItemRecord(req.body.itemRecordId);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteTask(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskRepository.delete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
