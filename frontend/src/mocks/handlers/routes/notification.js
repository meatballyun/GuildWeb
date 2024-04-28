import { HttpResponse, http } from 'msw';
import { BASE_API_URL } from '../../../api';
import { GUILD } from './guild/constants';

const NOTIFICATIONS = [
  {
    id: 0,
    sender: GUILD[0],
    title:
      '標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知標題很長的通知',
    description:
      '內容很長的通知內容\n很長的通知內容很長的通知內容很長的通知內容很長的通知內容很長的通知\n內容很長的通知內容很長的通知內容很長的通知內容很長的通知內容很長的通知',
    read: false,
    type: 'Guilds',
  },
  {
    id: 1,
    sender: GUILD[1],
    title: "The Blades of Fire Guild' invites you to join.",
    description: "Blades of Fire Guild' invites you to join the guild.",
    read: false,
    type: 'Guilds',
  },
  {
    id: 2,
    sender: GUILD[2],
    title: "The Blades of Fire Guild' invites you to join.",
    description: "Blades of Fire Guild' invites you to join the guild.",
    read: true,
    type: 'Guilds',
  },
];

const BASE_NOTIFICATION_URL = `${BASE_API_URL}/notifications`;

export const notifications = [
  http.get(BASE_NOTIFICATION_URL, async ({ request }) => {
    return HttpResponse.json({
      data: NOTIFICATIONS,
    });
  }),
  http.get(`${BASE_NOTIFICATION_URL}/:id`, async ({ params }) => {
    return HttpResponse.json({
      data: NOTIFICATIONS[params.id],
    });
  }),
];
