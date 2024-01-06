<template>
  <PageWrapper :title="t('page.page2.title')">
    <Card>
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn"> </BasicForm>
      <BasicTable @register="registerTable">
        <template #expandedRowRender="{ record }">
          <Row :gutter="16" v-for="(item, key) of record.categoryList" :key="key">
            <Col>categoryId: {{ item.categoryId }}</Col>
            <Col>categoryName: {{ item.categoryName }}</Col>
            <Col>categoryNameEn: {{ item.categoryNameEn }}</Col>
            <Col>categoryParentId: {{ item.categoryParentId }}</Col>
          </Row>
        </template>
      </BasicTable>
    </Card>
  </PageWrapper>
</template>
<script lang="ts">
  // excel配置展示
  import { defineComponent, onMounted } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { Alert, Card, Row, Col } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { api_excel_configList } from '/@/api';

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
      Row,
      Col,
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
          span: 24,
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
        expandRowByClick: true,
        columns: [
          {
            title: '序号',
            dataIndex: 'id',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: '计算的顺序',
            dataIndex: 'calculateOrder',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: '分类',
            dataIndex: 'categorysCalculate',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '关键字',
            dataIndex: 'categorysCalculateKeyword',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '分类优先级',
            dataIndex: 'categorysCalculatePriority',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: '描述',
            dataIndex: 'description',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: 'Excel 计算',
            dataIndex: 'excelCalculate',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: 'Excel的位置 ',
            dataIndex: 'excelIndex',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '字段名计算  ',
            dataIndex: 'fieldCalculate',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '报表排序',
            dataIndex: 'fieldOrder',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: '是否显示(invisible)',
            dataIndex: 'invisible',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '语言',
            dataIndex: 'language',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: '报表字段名',
            dataIndex: 'reportField',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '报表名',
            dataIndex: 'reportId',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: '符号',
            dataIndex: 'reportMathSymbol',
            width: 150,
            align: 'left',
            sorter: true,
          },
        ],
      });
      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let res = await api_excel_configList(params);
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