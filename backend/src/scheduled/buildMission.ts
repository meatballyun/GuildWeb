import { MissionTemplateModel, MissionTemplateItemModel } from '../models';
import { missionService } from '../services/guild';
import { ApplicationError } from '../utils/error/applicationError';
import { formatTimestamp } from '../utils/timeHandler';

export const buildMissionByMissionTemplates = async () => {
  const missionTemplates = await MissionTemplateModel.getAll();
  if (!missionTemplates) return;
  const currentTime = new Date();
  missionTemplates.map(async ({ creatorId: uid, guildId, generationTime: initiationTime, deadline, ...otherData }) => {
    if (new Date(initiationTime) < currentTime) {
      const items = await MissionTemplateItemModel.getAll(otherData.id);
      if (items?.length) await missionService.create({ initiationTime, deadline, items, ...otherData }, guildId, uid);

      let unit;
      if (otherData.type === 'daily') unit = 'DAY';
      else if (otherData.type === 'weekly') unit = 'WEEK';
      else if (otherData.type === 'monthly') unit = 'MONTH';
      else throw new ApplicationError(400);
      const generationTime = await MissionTemplateModel.DATE_ADD(formatTimestamp(initiationTime), 1, unit);
      const newDeadline = await MissionTemplateModel.DATE_ADD(formatTimestamp(deadline), 1, unit);
      await MissionTemplateModel.updateTime(otherData.id, generationTime, newDeadline);
    }
  });
};
