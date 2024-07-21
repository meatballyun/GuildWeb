import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { missionService } from '../../services/guild';
import { Membership } from '../../types/user/userGuildRelation';

export const getUserMissions = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionService.getUserMissions(req.userId as number);
  return res.status(200).json({ data });
};

export const getMissions = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionService.getAll(req.params, req.query, req.userId as number);
  return res.status(200).json({ data });
};

export const getMissionDetail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionService.getOne(req.params, req.userId as number);
  return res.status(200).json({ data });
};

export const acceptMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.accept(req.params, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const abandonMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.abandon(req.params, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const addMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionService.create(req.body, req.params.gid, req.userId as number);
  return res.status(200).json({ data });
};

export const completeMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.complete(req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const failMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.fail(req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const updateMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await missionService.update(req.body, req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data });
};

export const cancelMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.cancel(req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const restoreMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.restore(req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const submitMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.submit(req.params, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};

export const clickCheckboxForItemRecord = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.clickCheckboxForItemRecord(req.params.irid);
  return res.status(200).json({ data: 'OK' });
};

export const deleteMission = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await missionService.remove(req.params, req.member?.membership as Membership, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};
