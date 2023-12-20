import { MockMethod } from 'vite-plugin-mock';
import { Random } from 'mockjs';
import { resultPageSuccess } from '../_util';

function getRandomPics(count = 10): string[] {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(Random.image('800x600', Random.color(), Random.color(), Random.title()));
  }
  return arr;
}

const List_001 = (() => {
  const result: any[] = [];
  for (let index = 0; index < 200; index++) {
    result.push({
      id: `${index}`,
      'comcode|100000-10000000': 100000,
      comname: '@cword(4,8)',
      'openunitcode|100000-10000000': 100000,
      ctl_name: '@cword(4,8)',
      account_name: '@cword(4,8)',
      'account_no|100000-10000000': 100000,
      ban_cnaps_name: '@cword(4,8)',
      'bankcodenumber|100000-10000000': 100000,
      country: '@city',
      'crycycode|1': ['CNY', 'USD', 'JPY', 'EUR'],
      'balance|100-10000000': 100000,
      bankbalancedate: '@datetime',
      'accounttype|1': ['基本存款户', '一般存款户', '专用存款户', '临时存款户', '其他存款户'],
      'direct_type|1': ['未开通', '已开通'],
      'onlinetype|1': ['非监控', '可监控', '可归集'],
      'accountsta|1': ['续存', '注销'],
      account_startdt: `@date('yyyy-MM-dd')`,
      account_enddt: `@date('yyyy-MM-dd')`,
      dayidx: `@date('yyyy-MM-dd')`,
    });
  }
  return result;
})();

export default [
  {
    url: '/basic-api/api_001',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, List_001);
    },
  },
] as MockMethod[];
