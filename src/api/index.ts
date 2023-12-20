import { defHttp } from '/@/utils/http/axios';

export const api_0001 = (params: any) =>
  defHttp.get({
    url: '/api_001',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
export const api_login = (params: any) =>
  defHttp.get({
    url: '/biz/login',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
export const api_password_login = (params: any) =>
  defHttp.get({
    url: '/biz/passwordlogin',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
