import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { MissionTemplateService } from '../../services/guild/missionTemplate';
import { Membership } from '../../types/user/userGuildRelation';

export class MissionTemplateController {
  static async getMissionTemplates(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionTemplateService.getAll(req.params.gid, req.query.q);
    return res.status(200).json({ data });
  }

  static async getMissionTemplateDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionTemplateService.getOne(req.params.ttid);
    return res.status(200).json({ data });
  }

  static async addMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionTemplateService.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async updateMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionTemplateService.update(req.body, req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async deleteMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionTemplateService.delete(req.params.ttid, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
