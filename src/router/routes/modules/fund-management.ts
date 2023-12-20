import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';
import { t } from '/@/hooks/web/useI18n';
import { FundManagementMenuList } from '/@/pages/menu';

function createRoute(menus: Array<any>) {
  let list = menus.map((item) => {
    let route = {
      ...item,
      name: item.path,
      meta: {
        title: item.title,
        icon: item.icon,
      },
    };
    if (typeof item.children !== 'undefined' && item.children instanceof Array) {
      route.children = createRoute(item.children);
      route.component = getParentLayout(item.name);
    } else {
      route.component = () => import('/@/views/fund-management/template1.vue');
    }
    return route;
  });
  return list;
}

const permission: AppRouteModule = {
  path: '/fund-management',
  name: 'FundManagement',
  component: LAYOUT,
  redirect: '/fund-management/bank-account',
  meta: {
    orderNo: 15,
    icon: 'material-symbols:paid-outline-rounded',
    title: t('page.moduleTitle1'),
  },
  children: [
    {
      path: 'demo1',
      name: 'Demo1',
      meta: {
        icon: 'material-symbols:currency-exchange',
        title: t('page.page1.title'),
      },
      component: () => import('/@/views/fund-management/demo1.vue'),
    },
    ...createRoute(FundManagementMenuList),
  ],
};

export default permission;
