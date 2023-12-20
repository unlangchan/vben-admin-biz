import { defHttp } from '/@/utils/http/axios';

export const api_0001 = (params: any) =>
  defHttp.get({
    url: '/api_001',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
