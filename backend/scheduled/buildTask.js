const TaskTemplate = require('../models/guild/taskTemplate.model');
const TaskTemplateItem = require('../models/guild/taskTemplateItem.model');
const TaskRepository = require('../repositories/guild/task.repository.js');
const ApplicationError = require('../utils/error/applicationError.js');

const buildTaskByTaskTemplates = async () => {
  const taskTemplates = await TaskTemplate.getAll();
  if (!taskTemplates) return;
  const currentTime = new Date();
  await taskTemplates.map(
    async ({ creatorId: uid, guildId, generationTime: initiationTime, deadline, ...otherData }) => {
      if (new Date(initiationTime) < currentTime) {
        const templateItems = await TaskTemplateItem.getAll(otherData.id);
        // prettier-ignore
        await TaskRepository.create({ initiationTime, deadline, items: templateItems, ...otherData }, guildId, uid);

        let unit;
        if (otherData.type === 'Daily') unit = 'DAY';
        else if (otherData.type === 'Weekly') unit = 'WEEK';
        else unit = 'MONTH';
        const newGenerationTime = await TaskTemplate.DATE_ADD(initiationTime, 1, unit);
        const newDeadline = await TaskTemplate.DATE_ADD(deadline, 1, unit);
        // prettier-ignore
        await TaskTemplate.updateTime(otherData.id, Object.values(newGenerationTime[0])[0], Object.values(newDeadline[0])[0]);
      }
    }
  );
};

module.exports = buildTaskByTaskTemplates;
