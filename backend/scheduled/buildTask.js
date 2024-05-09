const TaskTemplate = require('../models/guild/taskTemplate.model');
const TaskTemplateItem = require('../models/guild/taskTemplateItem.model');
const TaskRepository = require('../repositories/guild/task.repository.js');
const ApplicationError = require('../utils/error/applicationError.js');

const buildTaskByTaskTemplates = async () => {
  const taskTemplates = await TaskTemplate.getAll();
  if (!taskTemplates) return;
  const currentTime = new Date();
  taskTemplates.map(
    async ({ creatorId: uid, guildId, generationTime: initiationTime, deadline, ...otherData }) => {
      if (new Date(initiationTime) < currentTime) {
        const templateItems = await TaskTemplateItem.getAll(otherData.id);
        // prettier-ignore
        await TaskRepository.create({ initiationTime, deadline, templateItems, otherData }, guildId, uid);

        let unit;
        if (template.type === 'Daily') unit = 'DAY';
        else if (template.type === 'Weekly') unit = 'WEEK';
        else unit = 'MONTH';
        const generationTime = await TaskTemplate.DATE_ADD(template.GENERATION_TIME, 1, unit);
        const deadline = await TaskTemplate.DATE_ADD(template.DEADLINE, 1, unit);
        // prettier-ignore
        await TaskTemplate.updateTime(template.id, Object.values(generationTime[0])[0], Object.values(deadline[0])[0]);
      }
    }
  );
};

module.exports = buildTaskByTaskTemplates;
