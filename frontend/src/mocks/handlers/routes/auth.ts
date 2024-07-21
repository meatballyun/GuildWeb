import { HttpResponse, http } from 'msw';
import { PROFILE_IMAGE_URL } from './constants';
import { BASE_API_URL } from '../../constants';

export const auth = [
  // login
  http.post<never, { email?: string; password?: string }>(
    `${BASE_API_URL}/users/login`,
    async ({ request }) => {
      const params = await request.json();
      if (!params.email || !params.password)
        return HttpResponse.json(
          {
            success: false,
            message: 'Invalid username or password',
            error: 'Unauthorized',
          },
          { status: 403 }
        );
      if (params.email !== 'eva')
        return new HttpResponse(null, { status: 404 });
      if (params.password !== 'eva')
        return new HttpResponse(null, { status: 403 });
      return HttpResponse.json({
        data: { token: 'yoooo token!' },
      });
    }
  ),
  http.get(`${BASE_API_URL}/users/logout`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  // users
  http.get(`${BASE_API_URL}/users/me`, () => {
    return HttpResponse.json({
      data: {
        name: '天上天下宇宙至尊大大ㄉㄉ醬',
        id: 6,
        imageUrl: PROFILE_IMAGE_URL,
        email: 'eva@aa.cc',
        rank: 99,
        exp: 192873,
        upgradeExp: 99 * 99 * 10,
        carbs: 320,
        pro: 60,
        fats: 55,
        kcal: 2000,
      },
    });
  }),
  http.post<never, { email: string }>(
    `${BASE_API_URL}/users/signup`,
    async ({ request }) => {
      const params = await request.json();
      if (params.email === 'eva@example.com')
        return new HttpResponse(null, { status: 409 });
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.get(`${BASE_API_URL}/users/friends`, async ({ request }) => {
    return HttpResponse.json({
      success: true,
      message: 'User data retrieval successful',
      data: [
        { id: 15, name: 'Rexford', imageUrl: null, rank: 65 },
        { id: 74, name: 'Cyrex', imageUrl: null, rank: 34 },
        { id: 109, name: 'Zorexley', imageUrl: null, rank: 37 },
      ].filter(({ name }) => name),
    });
  }),
];
