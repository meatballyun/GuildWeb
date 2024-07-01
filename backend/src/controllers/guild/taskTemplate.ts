import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { TaskTemplateService } from '../../services/guild/taskTemplate';
import { Membership } from '../../types/user/userGuildRelation';

export class TaskTemplateController {
  static async getTaskTemplates(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateService.getAll(req.params.gid, req.query.q);
    return res.status(200).json({ data });
  }

  static async getTaskTemplateDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateService.getOne(req.params.ttid);
    return res.status(200).json({ data });
  }

  static async addTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateService.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async updateTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await TaskTemplateService.update(req.body, req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteTaskTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    await TaskTemplateService.delete(req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
