import { ApplicationError } from '../../utils/error/applicationError';
import { BaseGuild, Guild } from '../../types/guild/guild';
import { UserGuildRelationModel } from '../../models/user/userGuildRelation';
import { GuildModel } from '../../models/guild/guild';

export class GuildService {
  static #defaultTitle = 'Personal Cabin';
  static #defaultDescription = `In your Personal Cabin, you have the flexibility to select from various mission types like 'Ordinary', 'Emergency', and 'Repetitive', tailoring them to your specific needs. Additionally, you can customize the recurrence frequency, whether it's daily, weekly, or monthly, to suit your schedule. Furthermore, missions can be further broken down into multiple sub-goals, empowering you to gain a comprehensive overview of your pending missions and strategize your approach for more efficient planning and completion.`;
  static #defaultImageUrl = `${process.env.API_SERVICE_URL}/uploads/image/system/cabin.png`;

  static async getAll(uid: number) {
    const relations = await UserGuildRelationModel.getAllByUser(uid);
    if (relations) {
      const guilds = await Promise.all(
        relations.map(async ({ guildId, membership }) => {
          const { name, imageUrl } = (await GuildModel.getOne(guildId)) as Guild;
          return { id: guildId, membership, name, imageUrl };
        })
      );
      return guilds.filter((row) => {
        return row.membership !== 'pending';
      });
    }
  }

  static async getOne(guildId: number) {
    const guild = await GuildModel.getOne(guildId);
    return guild;
  }

  static async create(body: BaseGuild, uid: number) {
    const newGuildId = await GuildModel.create(body, uid);
    if (!newGuildId) throw new ApplicationError(400);

    const result = await UserGuildRelationModel.create(uid, newGuildId, 'master');
    if (!result) throw new ApplicationError(400);

    return { id: newGuildId };
  }

  static async addCabin(uid: number) {
    const newGuildId = await GuildModel.addCabin(uid, this.#defaultTitle, this.#defaultDescription, this.#defaultImageUrl);
    if (!newGuildId) throw new ApplicationError(400);

    const newUserGuildRelationId = await UserGuildRelationModel.create(uid, newGuildId, 'master');
    if (!newUserGuildRelationId) throw new ApplicationError(400);

    return { id: newGuildId };
  }

  static async update(guildId: number, body: Guild) {
    const newGuildId = await GuildModel.update(guildId, body);
    if (!newGuildId) throw new ApplicationError(400);
  }
}
