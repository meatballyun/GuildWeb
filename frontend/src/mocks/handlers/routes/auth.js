import { HttpResponse, http } from 'msw';
import { BASE_API_URL } from '../../../api';
import { PROFILE_IMAGE_URL } from './constants';

export const auth = [
  http.post(`${BASE_API_URL}/login`, async ({ request }) => {
    const params = await request.json();
    console.log(params);
    if (!params.email || !params.password) {
      return HttpResponse.json(
        { massage: 'email and password required' },
        { status: 403 }
      );
    }
    return HttpResponse.json({
      token: 'yoooo token!',
    });
  }),
  http.get(`${BASE_API_URL}/user/me`, () => {
    return HttpResponse.json({
      name: '天上天下宇宙至尊大大ㄉㄉ醬',
      id: 1,
      imageUrl: PROFILE_IMAGE_URL,
      rank: 999,
      exp: 192873,
      upgradeExp: 200000,
    });
  }),
];
