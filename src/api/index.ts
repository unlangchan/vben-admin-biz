import { defHttp } from '/@/utils/http/axios';
import { downloadByData } from '/@/utils/file/download';
import { ContentTypeEnum } from '../enums/httpEnum';

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
    searchText: inParams.searchText,
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
/** 分页查询 分录list */
export const api_entry_content_list = (params: any) =>
  defHttp
    .get({
      url: `/entry/content/list`,
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
/** 保存文本 生成分录 */
export const api_entry_parse = (params: any) =>
  defHttp
    .post({
      url: `/entry/parse`,
      params,
      headers: {
        ignoreCancelToken: true,
        'Content-type': ContentTypeEnum.FORM_DATA,
      },
    });
/** 分页查询 供应商与员工 */
export const api_entry_dict_list = (params: any) =>
  defHttp
    .get({
      url: `/entry/dict/list`,
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
/** 导入供应商员工 */
export const api_entry_newStoreInput = (params: any) =>
  defHttp
    .uploadFile({
      baseURL: '/api',
      url: `/entry/newStoreInput`,
      headers: {
        ignoreCancelToken: true,
      },
    }, params);

/** 类别删 */
export const api_entry_category_del = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/category/del`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 类别查tree */
export const api_entry_category_tree = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/category/tree`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 类别增 */
export const api_entry_category_save = (params: any) =>
  defHttp
    .post({
      url: `/v3/entry/category/save`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 类别改 */
export const api_entry_category_update = (params: any) =>
  defHttp
    .post({
      url: `/v3/entry/category/update`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 科目表删 */
export const api_entry_subject_del = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/subject/del`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 科目表查 */
export const api_entry_subject_page = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/subject/page`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    }).then((data) => {
      return {
        items: data.records,
        total: Number(data.total),
      };
    });
/** 科目表增 */
export const api_entry_subject_save = (params: any) =>
  defHttp
    .post({
      url: `/v3/entry/subject/save`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 分录配置删 */
export const api_entry_cfg_del = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/cfg/del`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 分录配置查 */
export const api_entry_cfg_page = (params: any) =>
  defHttp
    .get({
      url: `/v3/entry/cfg/page`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    }).then((data) => {
      return {
        items: data.records,
        total: Number(data.total),
      };
    });
/** 分录配置增 */
export const api_entry_cfg_save = (params: any) =>
  defHttp
    .post({
      url: `/v3/entry/cfg/save`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });
/** 分录配置增 */
export const api_entry_cfg_update= (params: any) =>
  defHttp
    .post({
      url: `/v3/entry/cfg/update`,
      params,
      headers: {
        ignoreCancelToken: true,
      },
    });