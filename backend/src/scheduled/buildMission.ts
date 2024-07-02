import { MissionTemplateModel } from '../models/guild/missionTemplate';
import { MissionTemplateItemModel } from '../models/guild/missionTemplateItem';
import { missionService } from '../services/guild';

const buildMissionByMissionTemplates = async () => {
  const missionTemplates = await MissionTemplateModel.getAll();
  if (!missionTemplates) return;
  const currentTime = new Date();
  missionTemplates.map(async ({ creatorId: uid, guildId, generationTime: initiationTime, deadline, ...otherData }) => {
    if (new Date(initiationTime) < currentTime) {
      const items = await MissionTemplateItemModel.getAll(otherData.id);
      if (items.length) await missionService.create({ initiationTime, deadline, items, ...otherData }, guildId, uid);

      let unit;
      if (otherData.type === 'daily') unit = 'DAY';
      else if (otherData.type === 'weekly') unit = 'WEEK';
      else unit = 'MONTH';
      const generationTime = await MissionTemplateModel.DATE_ADD(otherData.GENERATION_TIME, 1, unit);
      const newDeadline = await MissionTemplateModel.DATE_ADD(otherData.DEADLINE, 1, unit);
      await MissionTemplateModel.updateTime(otherData.id, Object.values(generationTime[0])[0], Object.values(newDeadline[0])[0]);
    }
  });
};

export default buildMissionByMissionTemplates;
