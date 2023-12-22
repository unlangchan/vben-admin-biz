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
/** 删除输入内容 */
export const api_content_delete = (params: any) =>
  defHttp.post({
    url: '/biz/content/delete',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });

/** 分页查询用户输入的内容 */
export const api_content_list = (inParams: any) => {
  let params = {
    startTime: inParams.startTime,
    endTime: inParams.endTime,
    currentPage: 10,
    pageSize: inParams.pageSize,
  };
  return defHttp
    .get({
      url: '/biz/content/list',
      params,
      headers: {
        ignoreCancelToken: true,
      },
    })
    .then((data) => {
      return {
        items: data.records,
        total: data.total,
      };
    });
};

/** 产品描述 */
export const api_description = (params: any) =>
  defHttp.get({
    url: '/biz/description',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });

/** 获取所有关键字(关键) */
export const api_keyword = (params: any) =>
  defHttp.get({
    url: '/biz/keyword',
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
/** 修改用户语言 */
export const api_modifyLanguage = (params: any) =>
  defHttp.post(
    {
      url: `/biz/modifyLanguage?language=${params?.language}`,
      // params,
      headers: {
        ignoreCancelToken: true,
      },
    },
    {},
  );

/** 保存内容 */
export const api_saveContent = (params: any) =>
  defHttp.post(
    {
      url: `/biz/saveContent?content=${params?.content}`,
      // params,
      headers: {
        ignoreCancelToken: true,
      },
    },
    {},
  );
