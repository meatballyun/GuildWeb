import type { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * API request config type
 *
 *     P - params type
 *     D - data type
 *     PP - path params type
 */
export interface APIRequestConfig<P = any, D = any, PP = any>
  extends Omit<AxiosRequestConfig<D>, 'params'> {
  params?: P;
  /**
   * @example
   * url: /users/{userID}
   * pathParams: {
   *   userID: '1'
   * }
   */
  pathParams?: PP;
}

export interface AxiosRequestParamsConfig<T>
  extends Omit<AxiosRequestConfig, 'params'> {
  params?: T;
}

export interface APIResponseData<D = 'OK'> {
  success: true;
  message: string;
  data: D;
}

export interface APIError<ErrorType = unknown, D = any>
  extends AxiosError<
    {
      success: true;
      message: string;
      data: ErrorType;
    },
    D
  > {}

export interface CommonColumn {
  id: number;
  createTime: Date;
  updateTime: Date;
  active?: boolean;
}
