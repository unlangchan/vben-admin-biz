import type { AppRouteModule } from '/@/router/types';
import { RoleEnum } from '/@/enums/roleEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const config: AppRouteModule = {
  path: '/configuration',
  name: 'Configuration',
  component: LAYOUT,
  meta: {
    title: t('page.moduleTitle2'),
    roles: [RoleEnum.SUPER],
    orderNo: 10,
  },
  children: [
    {
      path: 'excelConfig',
      name: 'ExcelConfig',
      meta: {
        title: t('page.page2.title'),
        roles: [RoleEnum.SUPER],
      },
      component: () => import('@/views/configs/excelConfig.vue'),
    },
    {
      path: 'keywordConfig',
      name: 'KeywordConfig',
      meta: {
        title: t('page.page3.title'),
        roles: [RoleEnum.SUPER],
      },
      component: () => import('@/views/configs/keywordConfig.vue'),
    },
    {
      path: 'staffAndCompany',
      name: 'staffAndCompany',
      meta: {
        title: t('page.page5.title'),
        roles: [RoleEnum.SUPER],
      },
      component: () => import('@/views/configs/staffAndCompany.vue'),
    },
  ],
};

export default config;
