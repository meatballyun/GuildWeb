import { Response, NextFunction } from 'express';
import { TypedRequest } from '../../types/TypedRequest';
import { MissionModel } from '../../models/guild/mission';
import { AdventurerModel } from '../../models/guild/adventurer';
import { MissionService } from '../../services/guild/mission';
import { Mission } from '../../types/guild/mission';
import { Membership } from '../../types/user/userGuildRelation';

export class MissionController {
  static async getUserMissions(req: TypedRequest, res: Response, next: NextFunction) {
    const query = await AdventurerModel.getAllByUser(req.session.passport.user);
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
    const data = await MissionService.getAll(req.params, req.query, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async getMissionDetail(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionService.getOne(req.params, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async acceptMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.accept(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async abandonMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.abandon(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async addMission(req: TypedRequest, res: Response, next: NextFunction) {
    const data = await MissionService.create(req.body, req.params.gid, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async completeMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.complete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async failMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.fail(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async updateMission(req: TypedRequest, res: Response, next: NextFunction) {
    // prettier-ignore
    const data = await MissionService.update( req.body, req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data });
  }

  static async cancelMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.cancel(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async restoreMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.restore(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async submitMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.submit(req.params, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }

  static async clickCheckboxForItemRecord(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.clickCheckboxForItemRecord(req.body.itemRecordId);
    return res.status(200).json({ data: 'OK' });
  }

  static async deleteMission(req: TypedRequest, res: Response, next: NextFunction) {
    await MissionService.delete(req.params, req.member?.membership as Membership, req.session.passport.user);
    return res.status(200).json({ data: 'OK' });
  }
}
