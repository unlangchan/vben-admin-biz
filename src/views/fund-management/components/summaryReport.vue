<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #form-advanceAfter>
      <!-- <div class="extendActionBox"> -->
        <a-button type="primary" @click="handleExport">{{ t('page.page1.export') }}</a-button>
      <!-- </div> -->
    </template>
  </BasicTable>
  <BasicTable @register="registerTable1">
    <template #form-custom> custom-slot </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { Alert } from 'ant-design-vue';
  import { api_content_delete, api_content_list, api_export, api_generator_bill } from '/@/api';

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

      const columns = ref<Array<any>>([]);
      const columns1 = ref<Array<any>>([]);
      const [registerTable, { getForm, setTableData }] = useTable({
        title: t('page.page1.income'),
        useSearchForm: true,
        scroll: { y: 'auto' },
        handleSearchInfoFn,
        showTableSetting: true,
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
        tableSetting: {
          redo: false,
          size: false,
          setting: false,
          fullScreen: false,
        },
      });
      async function handleExport() {
        let params = getForm().getFieldsValue();
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
        dataSource: [],
        pagination: false,
        columns: columns1,
        tableSetting: {
          redo: false,
          size: false,
          setting: false,
          fullScreen: false,
        },
      });

      async function handleSearchInfoFn(params) {
        openFullLoading();
        // try {
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
        let dataSource = [{}],
          dataSource1 = [{}],
          columnValues = [],
          columnValues1 = [];
        data.pl.forEach((item, index) => {
          let key = 'fieldName_' + index;
          columnValues.push({
            title: item.fieldName,
            dataIndex: key,
            width: 250,
          });
          dataSource[0][key] = item.amount;
        });
        data.bs.forEach((item, index) => {
          let key = 'fieldName_' + index;
          columnValues1.push({
            title: item.fieldName,
            dataIndex: key,
            width: 250,
          });
          dataSource1[0][key] = item.amount;
        });
        columns.value = columnValues;
        columns1.value = columnValues1;
        if (columns.value.length < 5) {
          columns.value.push({
            title: '',
            dataIndex: 'empty',
          });
        }
        if (columns1.value.length < 5) {
          columns1.value.push({
            title: '',
            dataIndex: 'empty',
          });
        }
        setTableData(dataSource);
        setTableData1(dataSource1);
        // } catch (error) {}
        closeFullLoading();
      }
      return {
        t,
        registerTable,
        handleExport,
        registerTable1,
      };
    },
  });
</script>
<style scoped>
  .vben-basic-table.vben-basic-table-form-container {
    padding: 0px;
  }
</style>