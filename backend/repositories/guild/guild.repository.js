const TaskTemplate = require('../../models/guild/taskTemplate.model.js');
const TaskTemplateItem = require('../../models/guild/taskTemplateItem.model');
const Item = require('../../models/guild/item.model');
const ItemRecord = require('../../models/guild/itemRecord.model');
const Guild = require('../../models/guild/guild.model');
const UserGuildRelation = require('../../models/user/userGuildRelation.model');
const ApplicationError = require('../../utils/error/applicationError.js');

class GuildRepository {
  static #defaultTitle = 'Personal Cabin';
  static #defaultDescription = `In your Personal Cabin, you have the flexibility to select from various task types like 'Ordinary', 'Emergency', and 'Repetitive', tailoring them to your specific needs. Additionally, you can customize the recurrence frequency, whether it's daily, weekly, or monthly, to suit your schedule. Furthermore, tasks can be further broken down into multiple sub-goals, empowering you to gain a comprehensive overview of your pending tasks and strategize your approach for more efficient planning and completion.`;
  static #defaultImageUrl = `${process.env.API_SERVICE_URL}/uploads/image/system/cabin.png`;

  static async getAll(uid) {
    const relations = await UserGuildRelation.getAllByUser(uid);
    if (relations) {
      const guilds = await Promise.all(
        relations.map(async ({ guildId, membership }) => {
          const { name, imageUrl } = await Guild.getOne(guildId);
          return { id: guildId, membership, name, imageUrl };
        })
      );
      return guilds.filter((row) => {
        return row.membership !== 'Pending';
      });
    }
  }

  static async getOne(guildId) {
    const guild = await Guild.getOne(guildId);
    return guild;
  }

  static async create(body, uid) {
    const newGuildId = await Guild.create(uid, body);
    if (!newGuildId) throw new ApplicationError(400);

    const result = await UserGuildRelation.create(uid, newGuildId, 'Master');
    if (!result) throw new ApplicationError(400);

    return { id: newGuildId };
  }

  static async addCabin(uid) {
    const newGuildId = await Guild.addCabin(
      uid,
      this.#defaultTitle,
      this.#defaultDescription,
      this.#defaultImageUrl
    );
    if (!newGuildId) throw new ApplicationError(400);

    const newUserGuildRelationId = await UserGuildRelation.create(uid, newGuildId, 'Master');
    if (!newUserGuildRelationId) throw new ApplicationError(400);

    return { id: newGuildId };
  }

  static async update(guildId, body) {
    const newGuildId = await Guild.update(guildId, body);
    if (!newGuildId) throw new ApplicationError(400);
  }
}

module.exports = GuildRepository;
