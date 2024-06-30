import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { TaskTemplateRepository } from '../../repositories/guild/taskTemplate.repository';
import { Membership } from '../../types/user/userGuildRelation';

export class TaskTemplateController {
  static async getTaskTemplates(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateRepository.getAll(req.params.gid, req.query.q);
    return res.status(200).json({ data });
  }

  static async getTaskTemplateDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateRepository.getOne(req.params.ttid);
    return res.status(200).json({ data });
  }

  static async addTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateRepository.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async updateTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateRepository.update(req.body, req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskTemplateRepository.delete(req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
