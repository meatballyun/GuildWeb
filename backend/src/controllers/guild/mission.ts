import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { MissionModel } from '../../models/guild/mission';
import { AdventurerModel } from '../../models/guild/adventurer';
import { missionService } from '../../services/guild';
import { Mission } from '../../types/guild/mission';
import { Membership } from '../../types/user/userGuildRelation';

export class MissionController {
  static async getUserMissions(req: TypedRequest, res: Response, next: NextFunction) {
    const query = await AdventurerModel.getAllByUser(req.userId as number);
    let data: Mission[] = [];
    if (query?.length) {
      await Promise.all(
        query.map(async (i) => {
          const missions = await MissionModel.getOne(i.TASK_ID);
          if (missions?.length) {
            const mission = await Promise.all(
              missions
                .filter((row: Mission) => {
                  return row.STATUS === 'Established' || row.STATUS === 'In Progress';
                })
                .map(async (row: Mission) => {
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
            data.push(...mission);
          }
        })
      );
    }
    return res.status(200).json({ data });
  }

  static async getMissions(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionService.getAll(req.params, req.query, req.userId as number);
    return res.status(200).json({ data });
  }

  static async getMissionDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionService.getOne(req.params, req.userId as number);
    return res.status(200).json({ data });
  }

  static async acceptMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.accept(req.params, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async abandonMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.abandon(req.params, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async addMission(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await missionService.create(req.body, req.params.gid, req.userId as number);
    return res.status(200).json({ data });
  }

  static async completeMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.complete(req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async failMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.fail(req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateMission(req: TypedRequest, res: Response, next: NextFunction) {
    // prettier-ignore
    const data = await missionService.update( req.body, req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data });
  }

  static async cancelMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.cancel(req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async restoreMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.restore(req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async submitMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.submit(req.params, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }

  static async clickCheckboxForItemRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.clickCheckboxForItemRecord(req.body.itemRecordId);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteMission(req: TypedRequest, res: Response, next: NextFunction) {
    await missionService.remove(req.params, req.member?.membership as Membership, req.userId as number);
    return res.status(200).json({ data: 'OK' });
  }
}
