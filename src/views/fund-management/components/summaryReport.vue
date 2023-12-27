<template>
  <BasicForm ref="formRef" submitOnReset @register="registerForm" @submit="handleSearchInfoChange">
    <template #advanceAfter>
      <a-button type="primary" @click="handleExport">{{ t('page.page1.export') }}</a-button>
    </template>
  </BasicForm>
  <Row>
    <Col :span="12">
      <BasicTable @register="registerTable1"> </BasicTable>
    </Col>
    <Col :span="12">
      <BasicTable @register="registerTable"> </BasicTable>
    </Col>
  </Row>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, unref } from 'vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { Alert, Row, Col } from 'ant-design-vue';
  import { api_content_delete, api_content_list, api_export, api_generator_bill } from '/@/api';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading, useLoading } from '/@/components/Loading';
  const { createMessage } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      BasicForm,
      BasicTable,
      AAlert: Alert,
      Row,
      Col,
      TableAction,
    },
    setup() {
      onMounted(async () => {
        handleSearchInfoFn({
          time: [
            moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
            moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
          ],
        });
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('page.loadding'),
      });
      const formRef = ref(null);
      const columns = ref<Array<any>>([
        {
          title: 'Label',
          dataIndex: 'label',
          width: 250,
          align: 'right',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          width: 250,
          align: 'left',
        },
      ]);
      const [registerForm] = useForm({
        actionColOptions: {
          xl: 12,
          xxl: 8,
        },
        labelWidth: '12em',

        model: {
          time: [
            moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
            moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
          ],
        },
        schemas: [
          {
            field: `time`,
            label: t('page.page1.colums.time'),
            component: 'RangePicker',
            componentProps: {
              showTime: true,
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
              defaultValue: [
                moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
                moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
              ],
            },
            colProps: {
              xl: 12,
              xxl: 8,
            },
          },
        ],
      });
      const [registerTable, { setTableData }] = useTable({
        title: t('page.page1.income'),
        useSearchForm: false,
        scroll: { y: 'auto' },
        showTableSetting: true,
        showIndexColumn: false,
        showHeader: false,
        columns: columns,
        dataSource: [],
        pagination: false,
        tableSetting: {
          redo: false,
          size: false,
          setting: false,
          fullScreen: false,
        },
      });
      async function handleExport() {
        let params = unref(formRef).getFieldsValue();
        try {
          let outParams = {};
          for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              const element = params[key];
              if (element instanceof Array) {
                if (key === 'time') {
                  outParams['startTime'] = element[0];
                  outParams['endTime'] = element[1];
                }
              } else {
                outParams[key] = element;
              }
            }
          }
          await api_export(outParams);
        } catch (error) {}
        closeFullLoading();
      }
      const [registerTable1, { getForm: getForm1, setTableData: setTableData1 }] = useTable({
        title: t('page.page1.debt'),
        useSearchForm: false,
        scroll: { y: 'auto' },
        showTableSetting: true,
        showIndexColumn: false,
        showHeader: false,
        columns: columns,
        dataSource: [],
        pagination: false,
        tableSetting: {
          redo: false,
          size: false,
          setting: false,
          fullScreen: false,
        },
      });

      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let outParams = {};
          for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              const element = params[key];
              if (element instanceof Array) {
                if (key === 'time') {
                  outParams['startTime'] = element[0];
                  outParams['endTime'] = element[1];
                }
              } else {
                outParams[key] = element;
              }
            }
          }
          let data = await api_generator_bill(outParams);
          let dataSource = [],
            dataSource1 = [],
            columnValues = [],
            columnValues1 = [];
          data.pl.forEach((item, index) => {
            dataSource.push({
              label: item.fieldName,
              value: item.amount,
            });
          });
          data.bs.forEach((item, index) => {
            dataSource1.push({
              label: item.fieldName,
              value: item.amount,
            });
          });
          setTableData(dataSource);
          setTableData1(dataSource1);
        } catch (error) {}
        closeFullLoading();
      }
      return {
        t,
        registerTable,
        handleExport,
        registerTable1,
        registerForm,
        handleSearchInfoChange: handleSearchInfoFn,
        formRef,
      };
    },
  });
</script>
<style scoped>
  .vben-basic-table.vben-basic-table-form-container {
    padding: 0px;
  }
</style>