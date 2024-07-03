import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { missionTemplateService } from '../../services/guild';
import { Membership } from '../../types/user/userGuildRelation';

export class MissionTemplateController {
  static async getMissionTemplates(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionTemplateService.getAll(req.params.gid, req.query.q);
    return res.status(200).json({ data });
  }

  static async getMissionTemplateDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionTemplateService.getOne(req.params.ttid);
    return res.status(200).json({ data });
  }

  static async addMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionTemplateService.create(req.body, req.params.gid, req.userId as number);
    return res.status(200).json({ data });
  }

  static async updateMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionTemplateService.update(req.body, req.params.ttid, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data });
  }

  static async deleteMissionTemplate(req: TypedRequest, res: Response, next: NextFunction) {
    await missionTemplateService.remove(req.params.ttid, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }
}
