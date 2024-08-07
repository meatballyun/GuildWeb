import { baseInstance } from './instance';
import type { APIRequestConfig, APIResponseData } from './interface';

export const uploadImage = async ({
  data,
}: APIRequestConfig<never, { type: string; image: any }>) => {
  const url = `/upload/images`;
  const res = await baseInstance.post<APIResponseData<{ imageUrl: string }>>(
    url,
    data
  );
  return res.data.data;
};
