import { HttpResponse, http } from 'msw';
import { BASE_API_URL } from '../../../api';

export const guild = [
  // login
  http.get(`${BASE_API_URL}/guild`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Data retrieval successfully.',
      data: [
        {
          id: 1,
          name: 'Blades of Fire Guild',
          imageUrl: 'https://images.plurk.com/3wcE9iSozi6UBO3lToF5el.png',
        },
        {
          id: 2,
          name: 'Ancient Explorers Association',
          imageUrl: 'https://images.plurk.com/2M5Cw3v6Az9fU17RRxmIlQ.jpg',
        },
        {
          id: 3,
          name: 'Magic Explorers Guild',
          imageUrl: 'https://images.plurk.com/78KeGU6e08O6hjFSIhiuCM.png',
        },
      ],
    });
  }),
];
