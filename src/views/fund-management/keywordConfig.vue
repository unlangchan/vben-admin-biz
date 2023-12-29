<template>
  <PageWrapper :title="t('page.page3.title')">
    <Card>
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn"> </BasicForm>
      <BasicTable @register="registerTable"> </BasicTable>
    </Card>
  </PageWrapper>
</template>
<script lang="ts">
  // 关键字配置展示
  import { defineComponent, onMounted } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { Alert, Card } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { api_keyword_configList } from '/@/api';

  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading, useLoading } from '/@/components/Loading';
  const { t } = useI18n();

  export default defineComponent({
    components: {
      PageWrapper,
      BasicForm,
      BasicTable,
      AAlert: Alert,
      Card,
    },
    setup() {
      onMounted(async () => {
        handleSearchInfoFn({});
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('page.loadding'),
      });
      const [registerForm] = useForm({
        actionColOptions: {
          xl: 24,
          xxl: 24,
        },
        labelWidth: '12em',
        model: {},
        schemas: [],
      });
      const [registerTable, { setTableData, setPagination }] = useTable({
        scroll: { y: 'auto' },
        useSearchForm: false,
        tableSetting: { fullScreen: true },
        showTableSetting: true,
        showIndexColumn: false,
        columns: [
          {
            title: '类别id',
            dataIndex: 'categoryId',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '类别名称',
            dataIndex: 'categoryName',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '分类英文名',
            dataIndex: 'categoryNameEn',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '父类的id',
            dataIndex: 'categoryParentId',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '关键字',
            dataIndex: 'keyword',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '关键字英文名',
            dataIndex: 'keywordEn',
            width: 175,
            align: 'left',
            sorter: true,
          },
        ],
      });
      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let res = await api_keyword_configList(params);
          setTableData(res.items);
          setPagination({ current: 1 });
        } catch (error) {}
        closeFullLoading();
      }

      return {
        t,
        registerTable,
        registerForm,
        handleSearchInfoFn,
      };
    },
  });
</script>