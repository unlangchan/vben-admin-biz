import type { AppRouteModule } from '/@/router/types';

import {  LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';


const permission: AppRouteModule = {
  path: '/financialTransactions',
  name: 'FinancialTransactions',
  component: LAYOUT,
  redirect: '/financialTransactions/index',
  meta: {
    title: t('page.page4.title'),
    icon: 'material-symbols:book',
    hideChildrenInMenu: true,
    orderNo: 2,
  },
  children: [
    {
      path: 'index',
      name: 'FinancialTransactiongsPage',
      meta: {
        icon: 'material-symbols:book',
        title: t('page.page4.title'),
      },
      component: () => import('/@/views/financial-transactions/financialTransactions.vue'),
    },
  ],
};

export default permission;
