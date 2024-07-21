import { TypedRequest } from '../../types/TypedRequest';
import { Response, NextFunction } from 'express';
import { guildService } from '../../services/guild';
import { userInfoService } from '../../services/user';

export const getGuilds = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await guildService.getAll(req.userId as number);
  return res.status(200).json({ data });
};

export const getGuildDetail = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await guildService.getOne(req.params.gid);
  return res.status(200).json({ data });
};

export const addGuild = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await guildService.create(req.body, req.userId as number);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data });
};

export const addCabin = async (req: TypedRequest, res: Response, next: NextFunction) => {
  const data = await guildService.addCabin(req.userId as number);
  await userInfoService.updateExp(req.userId as number, 1);
  return res.status(200).json({ data });
};

export const updateGuild = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await guildService.update(req.params.gid, req.body);
  return res.status(200).json({ data: req.params.gid });
};

export const deleteGuild = async (req: TypedRequest, res: Response, next: NextFunction) => {
  await guildService.remove(req.params.gid, req.userId as number);
  return res.status(200).json({ data: 'OK' });
};
