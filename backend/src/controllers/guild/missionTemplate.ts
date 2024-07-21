import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { missionTemplateService } from '../../services/guild';
import { Membership } from '../../types/user/userGuildRelation';

export const getMissionTemplates = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionTemplateService.getAll(req.params.gid, req.query.q);
  return res.status(200).json({ data });
};

export const getMissionTemplateDetail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionTemplateService.getOne(req.params.mtid);
  return res.status(200).json({ data });
};

export const addMissionTemplate = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionTemplateService.create(req.body, req.params.gid, req.userId as number);
  return res.status(200).json({ data });
};

export const updateMissionTemplate = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionTemplateService.update(req.body, req.params.mtid, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data });
};

export const deleteMissionTemplate = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionTemplateService.remove(req.params.mtid, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};
