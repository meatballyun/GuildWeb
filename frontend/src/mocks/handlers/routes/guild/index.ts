import { HttpResponse, http } from 'msw';
import { GUILD, TASKS, getMissionDetail, getUser } from './constants';
import { BASE_API_URL } from '../../../constants';

const BASE_GUILD_URL = `${BASE_API_URL}/guilds`;

export const guild = [
  http.get(`${BASE_GUILD_URL}`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Data retrieval successfully.',
      data: GUILD,
    });
  }),
  http.get<{ gid: string }>(`${BASE_GUILD_URL}/:gid`, async ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Data uploaded successfully.',
      data: {
        ...GUILD[+params.gid - 1],
        description:
          "Blades of Fire Guild is a respected adventurers' association, famed for its brave members and commitment to combating evil. Situated in a vibrant city center, the guild provides training, support, and camaraderie to adventurers of all backgrounds. Join us in our quest to bring light and justice to the world!",
      },
    });
  }),
  http.get(`${BASE_API_URL}/guild/:id/member`, async ({ params }) => {
    if (params.id === '1')
      return HttpResponse.json({
        success: true,
        message:
          'You have successfully accepted the invitation and joined the guild.',
        data: getUser(),
      });
    if (params.id === '2')
      return HttpResponse.json({
        success: true,
        message:
          'You have successfully accepted the invitation and joined the guild.',
        data: getUser({ myMembership: 'vice', availableUser: [0, 1, 2, 3] }),
      });
    return HttpResponse.json({
      success: true,
      message:
        'You have successfully accepted the invitation and joined the guild.',
      data: getUser({ myMembership: 'master', availableUser: [1, 2, 3] }),
    });
  }),
  http.get(`${BASE_API_URL}/guild/:id/mission`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Data retrieval successful.',
      data: TASKS,
    });
  }),
  http.get(`${BASE_API_URL}/guild/:id/mission/:mid`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Data retrieval successful.',
      data: getMissionDetail(+params.mid),
    });
  }),
];
