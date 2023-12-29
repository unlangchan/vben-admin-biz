import { defHttp } from '/@/utils/http/axios';
import { downloadByData } from '/@/utils/file/download';

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
    currentPage: inParams.page,
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
        total: Number(data.total),
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
  defHttp.post({
    url: `/biz/modifyLanguage?language=${params?.language}`,
    // params,
    headers: {
      ignoreCancelToken: true,
    },
  });

/** 保存内容 */
export const api_saveContent = (params: any) =>
  defHttp.post({
    url: `/biz/saveContent?content=${params?.content}`,
    // params,
    headers: {
      ignoreCancelToken: true,
    },
  });
/** 生成报表 关键 */
export const api_generator_bill = (params: any) =>
  defHttp.post({
    url: `/biz/generator/bill`,
    params,
    headers: {
      ignoreCancelToken: true,
    },
  });
/** 导出 excel */
export const api_export = (params: any) =>
  defHttp
    .get(
      {
        url: `/biz/export`,
        params,
        responseType: 'blob',
        headers: {},
      },
      {
        isReturnNativeResponse: true,
      },
    )
    .then((response) => {
      const ContentDisposition = response.headers['content-disposition'];
      let filename = ContentDisposition.slice(28);
      filename = decodeURI(filename);
      downloadByData(response.data, filename);
    });

/** excel配置展示 */
export const api_excel_configList = (params: any) =>
  defHttp
    .get({
      url: `/biz/excel/configList`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    })
    .then((data) => {
      return {
        items: data,
        total: Number(data.length),
      };
    });
/** 关键字配置展示 */
export const api_keyword_configList = (params: any) =>
  defHttp
    .get({
      url: `/biz/keyword/configList`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    })
    .then((data) => {
      return {
        items: data,
        total: Number(data.length),
      };
    });
