<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #form-formFooter>
      <div class="extendActionBox">
        <a-button type="primary" @click="handleExport">{{ t('page.page1.export') }}</a-button>
      </div>
    </template>
  </BasicTable>
  <BasicTable @register="registerTable1">
    <template #form-formFooter>
      <div class="extendActionBox">
        <a-button type="primary" @click="handleExport1">{{ t('page.page1.export') }}</a-button>
      </div>
    </template>
    <template #form-custom> custom-slot </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { Alert } from 'ant-design-vue';
  import { api_content_delete, api_content_list, api_generator_bill } from '/@/api';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Loading, useLoading } from '/@/components/Loading';
  const { createMessage } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      BasicTable,
      AAlert: Alert,
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

      const columns = ref<Array<any>>([
        {
          title: t('page.page1.colums.tableName'),
          dataIndex: 'tableName',
          width: 250,
          align: 'left',
          sorter: true,
        },
        {
          title: t('page.page1.colums.amount'),
          dataIndex: 'amount',
          width: 250,
          align: 'left',
          sorter: true,
        },
        {
          title: t('page.page1.colums.language'),
          dataIndex: 'language',
          width: 150,
          align: 'left',
          sorter: true,
        },
        {
          title: t('page.page1.colums.count'),
          dataIndex: 'count',
          width: 150,
          align: 'left',
          sorter: true,
        },
        {
          title: t('page.page1.colums.fieldName'),
          dataIndex: 'fieldName',
          width: 150,
          align: 'left',
          sorter: true,
        },
      ]);
      const [registerTable, { getForm, setTableData }] = useTable({
        title: t('page.page1.income'),
        useSearchForm: true,
        scroll: { y: 'auto' },
        handleSearchInfoFn,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        dataSource: [],
        pagination: false,
        columns,
        formConfig: {
          labelWidth: '12em',
          model: {
            time: [
              moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
              moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
            ],
          },
          schemas: [
            // {
            //   field: `searchText`,
            //   label: t('page.page1.colums.searchText'),
            //   component: 'Input',
            //   colProps: {
            //     xl: 12,
            //     xxl: 8,
            //   },
            // },
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
        },
      });
      async function handleExport() {
        console.log('export :>> ');
      }
      const [registerTable1, { getForm: getForm1, setTableData: setTableData1 }] = useTable({
        title: t('page.page1.debt'),
        useSearchForm: false,
        scroll: { y: 'auto' },
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        dataSource: [],
        pagination: false,
        columns,
      });
      async function handleExport1() {
        console.log('export1 :>> ');
      }

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
          setTableData(data.bs);
          setTableData1(data.pl);
        } catch (error) {}
        closeFullLoading();
      }
      return {
        t,
        registerTable,
        handleExport,
        registerTable1,
        handleExport1,
      };
    },
  });
</script>
<style scoped>
  .vben-basic-table.vben-basic-table-form-container {
    padding: 0px;
  }
</style>