import { ApplicationError } from '../../utils/error/applicationError';
import { timeHandle } from '../../utils/timeHandler';
import { Membership } from '../../types/user/userGuildRelation';
import { MissionTime, MissionInfo } from '../../types/guild/mission';
import { TemplateItem } from '../../types/guild/missionTemplateItem';
import { Item } from '../../types/guild/item';
import { UserModel, MissionModel, ItemRecordModel, AdventurerModel } from '../../models';
import * as itemService from './item';
import * as itemRecordService from './itemRecord';
import * as adventurerService from './adventurer';
import { executeTransaction } from '../../utils/executeTransaction';
import moment from 'moment';

interface MissionDetailed extends MissionTime, MissionInfo {
  items: Item[] | TemplateItem[];
}

export const getAll = async ({ gid: guildId }: { gid: number }, { q: query }: { q?: string }, uid: number) => {
  const missions = query ? await MissionModel.getAllByGuildAndName(guildId, query) : await MissionModel.getAllByGuild(guildId);
  if (missions?.length) {
    const missionIds = missions.map(({ id }) => id);
    const adventurers = await AdventurerModel.getAllByManyMission(missionIds);
    const data = missions.map(({ id, creatorId, name, type, status, accepted }) => {
      let isAccepted = false;
      adventurers?.map(({ missionId, userId }) => {
        if (missionId === id && userId === uid) isAccepted = true;
      });
      return { id, creatorId, name, type, status, accepted, isAccepted };
    });

    return data;
  }
  return;
};

export const getOne = async ({ mid: missionId }: { mid: number }, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (mission) {
    const user = await UserModel.getOneById(mission.creatorId);
    if (!user) throw new ApplicationError(400);
    const { id, name, imageUrl } = user;
    const creator = { id, name, imageUrl };
    const adventurers = await adventurerService.getAdventurerInfo(missionId);
    const isAccepted = await adventurerService.isAdventurer(missionId, uid);
    const items = await itemService.getAll(missionId, uid, isAccepted);
    return { creator, ...mission, adventurers, items, isAccepted };
  }
  throw new ApplicationError(409);
};

export const getUserMissions = async (uid: number) => {
  const missions = await MissionModel.getAllByUser(uid);
  return missions;
};

export const create = async ({ initiationTime, deadline, items, ...otherData }: MissionDetailed, guildId: number, uid: number) => {
  const time = timeHandle(initiationTime, deadline);
  const newMissionId = await executeTransaction(async () => {
    const missionId = await MissionModel.create(uid, guildId, time, otherData);
    if (!missionId) throw new ApplicationError(400);
    await itemService.create(items, missionId);
    return missionId;
  });
  return newMissionId;
};

export const accept = async ({ mid: missionId }: { mid: number }, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  const isAccepted = await adventurerService.isAdventurer(missionId, uid);
  if (isAccepted) throw new ApplicationError(409);
  if (mission.accepted === 'max accepted') throw new ApplicationError(409);

  const adventurer = await AdventurerModel.create(missionId, uid);
  if (!adventurer) throw new ApplicationError(400);

  const items = await itemService.getAll(missionId, uid, false);
  if (items?.length) await itemRecordService.create(items as Item[], uid);
};

export const submit = async ({ mid: missionId }: { mid: number }, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  const adventurer = await AdventurerModel.getOne(missionId, uid);
  if (!adventurer) throw new ApplicationError(409);

  const currentTime = new Date();
  const initiationTime = new Date(mission.initiationTime);
  const deadline = new Date(mission.deadline);
  if (currentTime < initiationTime || currentTime > deadline) throw new ApplicationError(409);

  const result = await AdventurerModel.update(missionId, uid, 'completed', currentTime);
  if (!result) throw new ApplicationError(400);
};

export const abandon = async ({ mid: missionId }: { mid: number }, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  const isAccepted = await adventurerService.isAdventurer(missionId, uid);
  if (!isAccepted) throw new ApplicationError(409);

  await AdventurerModel.deleteByMissionAndUser(missionId, uid);
  await itemRecordService.deleteAllByMissionAndUser(missionId, uid);
};

export const complete = async ({ mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  await adventurerService.updateStatusByMissionComplete(missionId);
  const result = await MissionModel.updateStatus(missionId, 'completed');
  if (!result) throw new ApplicationError(400);
};

export const fail = async ({ mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  await adventurerService.updateStatusByMissionFail(missionId);
  const result = await MissionModel.updateStatus(missionId, 'expired');
  if (!result) throw new ApplicationError(400);
};

export const clickCheckboxForItemRecord = async (itemRecordId: number) => {
  const itemRecord = await ItemRecordModel.getOne(itemRecordId);
  if (itemRecord) {
    if (itemRecord.status) {
      await ItemRecordModel.update(itemRecordId, false);
    } else {
      await ItemRecordModel.update(itemRecordId, true);
    }
  } else throw new ApplicationError(404);
};

export const update = async ({ initiationTime, deadline, items, ...otherData }: MissionDetailed, { mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  const time = timeHandle(initiationTime, deadline);
  const result = await MissionModel.updateDetail(missionId, time, otherData);
  if (!result) throw new ApplicationError(400);

  await AdventurerModel.deleteByMission(missionId);
  await itemRecordService.deleteAllByMission(missionId);
  await itemService.update(items, missionId);

  return { id: missionId };
};

export const cancel = async ({ mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  await AdventurerModel.deleteByMission(missionId);
  await itemRecordService.deleteAllByMission(missionId);

  const result = await MissionModel.updateStatus(missionId, 'cancelled');
  if (!result) throw new ApplicationError(400);
};

export const restore = async ({ mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  const currentTime = new Date();
  const deadline = new Date(mission.deadline);
  if (currentTime > deadline) throw new ApplicationError(409);

  const result = await MissionModel.updateStatus(missionId, 'established');
  if (!result) throw new ApplicationError(400);
};

export const remove = async ({ mid: missionId }: { mid: number }, membership: Membership, uid: number) => {
  const mission = await MissionModel.getOne(missionId);
  if (!mission) throw new ApplicationError(404);
  if (membership === 'vice' && uid !== mission.creatorId) throw new ApplicationError(403);

  await AdventurerModel.deleteByMission(missionId);
  await itemService.remove(missionId);
  const result = await MissionModel.delete(missionId);
  if (!result) throw new ApplicationError(409);
};
