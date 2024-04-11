<template>
  <PageWrapper :title="t('page.page5.title')">
    <Card>
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn">
        <template #advanceAfter>
          <Upload
            accept=".xlsx"
            :showUploadList="false"
            :before-upload="(file, fileList) => beforeUpload(file, fileList)"
            :multiple="false"
          >
            <a-button>
              {{ t('page.page5.import') }}
            </a-button>
          </Upload>
        </template>
      </BasicForm>
      <BasicTable @register="registerTable"> </BasicTable>
    </Card>
  </PageWrapper>
</template>
<script lang="ts">
  // Staff and company
  import { defineComponent, onMounted } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { Alert, Card, Upload } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { api_entry_dict_list, api_entry_newStoreInput } from '/@/api';

  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading, useLoading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { notification } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      PageWrapper,
      BasicForm,
      BasicTable,
      AAlert: Alert,
      Card,
      Upload,
    },
    setup() {
      onMounted(async () => {
        handleSearchInfoFn({});
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('page.loading'),
      });
      const [registerForm, { submit }] = useForm({
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
        columns: [
          {
            title: 'dictType',
            dataIndex: 'dictType',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: 'dictDesc',
            dataIndex: 'dictDesc',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: 'dictName',
            dataIndex: 'dictName',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: 'dictValue',
            dataIndex: 'dictValue',
            width: 175,
            align: 'left',
            sorter: true,
          },
        ],
      });
      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let res = await api_entry_dict_list(params);
          setTableData(res.items);
          setPagination({ current: 1 });
        } catch (error) {}
        closeFullLoading();
      }

      async function beforeUpload(file) {
        openFullLoading();
        try {
          let res = await api_entry_newStoreInput({ file: file });
          notification.success({
            message: t('sys.api.operationSuccess'),
            duration: 3,
          });
          await submit();
        } catch (error) {}
        closeFullLoading();
      }
      return {
        t,
        registerTable,
        registerForm,
        handleSearchInfoFn,
        beforeUpload,
      };
    },
  });
</script>