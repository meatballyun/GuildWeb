import { ApplicationError } from '../../utils/error/applicationError';
import { BaseGuild, Guild } from '../../types/guild/guild';
import { UserGuildRelationModel, GuildModel, MissionModel, AdventurerModel, ItemModel, ItemRecordModel, MissionTemplateModel, MissionTemplateItemModel } from '../../models';
import { FE_URL } from '../../config';

const defaultTitle = 'Personal Cabin';
const defaultDescription = `In your Personal Cabin, you have the flexibility to select from various mission types like 'Ordinary', 'Emergency', and 'Repetitive', tailoring them to your specific needs. Additionally, you can customize the recurrence frequency, whether it's daily, weekly, or monthly, to suit your schedule. Furthermore, missions can be further broken down into multiple sub-goals, empowering you to gain a comprehensive overview of your pending missions and strategize your approach for more efficient planning and completion.`;
const defaultImageUrl = `${FE_URL}/uploads/image/system/cabin.png`;

export const getAll = async (uid: number) => {
  const relations = await UserGuildRelationModel.getAllByUser(uid);
  if (relations?.length) {
    const guilds = await Promise.all(
      relations.map(async ({ guildId, membership, name, imageUrl }) => {
        return { id: guildId, membership, name, imageUrl };
      })
    );

    return guilds.filter((row) => {
      return row.membership !== 'pending';
    });
  }
};

export const getOne = async (guildId: number) => {
  const guild = await GuildModel.getOne(guildId);
  return guild;
};

export const create = async (body: BaseGuild, uid: number) => {
  const newGuildId = await GuildModel.create(body, uid);
  if (!newGuildId) throw new ApplicationError(400);

  const result = await UserGuildRelationModel.create(uid, newGuildId, 'master');
  if (!result) throw new ApplicationError(400);

  return { id: newGuildId };
};

export const addCabin = async (uid: number) => {
  const newGuildId = await GuildModel.addCabin(uid, defaultTitle, defaultDescription, defaultImageUrl);
  if (!newGuildId) throw new ApplicationError(400);

  const newUserGuildRelationId = await UserGuildRelationModel.create(uid, newGuildId, 'master');
  if (!newUserGuildRelationId) throw new ApplicationError(400);

  return { id: newGuildId };
};

export const update = async (guildId: number, body: Guild) => {
  const newGuildId = await GuildModel.update(guildId, body);
  if (!newGuildId) throw new ApplicationError(400);
};

export const remove = async (guildId: number, uid: number) => {
  const missions = await MissionModel.getAllByGuild(guildId);

  if (missions?.length) {
    const missionIds = missions.map(({ id }) => id);
    await AdventurerModel.deleteManyByMission(missionIds);
    const items = await ItemModel.getAllByManyMissions(missionIds);
    if (items?.length) {
      const itemIds = items.map(({ id }) => id);
      await ItemRecordModel.deleteAllByManyItems(itemIds);
    }
    await ItemModel.deleteAllByManyMissions(missionIds);
    await MissionModel.deleteManyById(missionIds);
  }

  const missionTemplates = await MissionTemplateModel.getAllByGuild(guildId);
  if (missionTemplates?.length) {
    const missionTemplateIds = missionTemplates.map(({ id }) => id);
    await MissionTemplateItemModel.deleteByManyMissionTemplates(missionTemplateIds);
    await MissionTemplateModel.deleteAllByIds(missionTemplateIds);
  }

  const query = await GuildModel.deleteGuild(guildId);
  return query;
};
