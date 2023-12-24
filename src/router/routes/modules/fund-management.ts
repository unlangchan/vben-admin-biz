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
  path: '/accounting',
  name: 'Accounting',
  component: LAYOUT,
  redirect: '/accounting/index',
  meta: {
    hideChildrenInMenu: true,
    title: t('page.page1.title'),
  },
  children: [
    {
      path: 'index',
      name: 'AccountingPage',
      meta: {
        icon: 'material-symbols:currency-exchange',
        title: t('page.page1.title'),
      },
      component: () => import('/@/views/fund-management/accounting.vue'),
    },
    ...createRoute(FundManagementMenuList),
  ],
};

export default permission;
