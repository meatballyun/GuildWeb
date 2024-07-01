import { TaskTemplateModel } from '../models/guild/taskTemplate';
import { TaskTemplateItemModel } from '../models/guild/taskTemplateItem';
import { TaskService } from '../services/guild/task';

const buildTaskByTaskTemplates = async () => {
  const taskTemplates = await TaskTemplateModel.getAll();
  if (!taskTemplates) return;
  const currentTime = new Date();
  taskTemplates.map(async ({ creatorId: uid, guildId, generationTime: initiationTime, deadline, ...otherData }) => {
    if (new Date(initiationTime) < currentTime) {
      const items = await TaskTemplateItemModel.getAll(otherData.id);
      if (items.length) await TaskService.create({ initiationTime, deadline, items, ...otherData }, guildId, uid);

      let unit;
      if (otherData.type === 'daily') unit = 'DAY';
      else if (otherData.type === 'weekly') unit = 'WEEK';
      else unit = 'MONTH';
      const generationTime = await TaskTemplateModel.DATE_ADD(otherData.GENERATION_TIME, 1, unit);
      const newDeadline = await TaskTemplateModel.DATE_ADD(otherData.DEADLINE, 1, unit);
      await TaskTemplateModel.updateTime(otherData.id, Object.values(generationTime[0])[0], Object.values(newDeadline[0])[0]);
    }
  });
};

export default buildTaskByTaskTemplates;
