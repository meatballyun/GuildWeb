import { HttpResponse, http } from 'msw';
import { BASE_API_URL } from '../../../api';

export const auth = [
  http.get(`${BASE_API_URL}/user/me`, () => {
    return HttpResponse.json({
      name: '天上天下宇宙至尊大大ㄉㄉ醬',
      id: 1,
      imageUrl: null,
      rank: 999,
      exp: 192873,
      upgradeExp: 200000,
    });
  }),
];
