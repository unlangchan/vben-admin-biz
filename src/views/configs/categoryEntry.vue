<template>
  <PageWrapper :title="'类别配置'">
    <Card>
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn"> </BasicForm>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record, column)" />
          </template>
        </template>
      </BasicTable>
    </Card>
    <Drawer v-model:visible="visible" class="custom-class" title="新增类别" placement="right">
      <Row style="margin-bottom: 1em">
        <Col span="24">父类的code: </Col>
        <Col span="24">{{ `${formData1.categoryParentCode}` }}</Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">类别id: </Col>
        <Col span="24">
          <Input v-model:value="formData1.categoryCode" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">类别名称: </Col>
        <Col span="24">
          <Input v-model:value="formData1.categoryName" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">描述: </Col>
        <Col span="24">
          <Input v-model:value="formData1.description" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">关键字(逗号分割): </Col>
        <Col span="24">
          <Input v-model:value="formData1.keywords" />
        </Col>
      </Row>
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSave">提交</a-button>
      </template>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  // Staff and company
  import { defineComponent, onMounted, reactive, ref, unref } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { Alert, Card, Drawer, Row, Col, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    api_entry_category_del,
    api_entry_category_save,
    api_entry_category_tree,
    api_entry_category_update,
  } from '/@/api';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading, useLoading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  const { notification, createMessage: msg } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      PageWrapper,
      BasicForm,
      BasicTable,
      AAlert: Alert,
      Card,
      TableAction,
      Drawer,
      Row,
      Col,
      Input,
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
            title: '类别id(categoryCode)',
            dataIndex: 'categoryCode',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '类别名称(categoryName)',
            dataIndex: 'categoryName',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '介绍(description)',
            dataIndex: 'description',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '关键字(keywords)',
            dataIndex: 'keywords',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
        ],
        actionColumn: {
          width: 160,
          title: '操作(Action)',
          dataIndex: 'action',
        },
      });
      const resData = ref();
      const value = ref<string>();
      const currentEditKeyRef = ref('');
      const visible = ref<boolean>(false);
      const formData1 = reactive({
        categoryCode: '',
        categoryName: '',
        categoryParentCode: '',
        description: '',
        keywords: '',
      });
      const showDrawer = () => {
        visible.value = true;
      };
      const onClose = () => {
        visible.value = false;
      };

      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let res = await api_entry_category_tree({});
          resData.value = res;
          setTableData(res);
          setPagination({ current: 1 });
          handleChangeFn();
        } catch (error) {}
        closeFullLoading();
      }
      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.key;
        record.onEdit?.(true);
      }
      function handleAdd(record: EditRecordRow) {
        showDrawer();
        formData1.categoryParentCode = record.categoryCode;
        formData1.categoryCode = '';
        formData1.categoryName = '';
        formData1.description = '';
        formData1.keywords = '';
      }
      async function onSave() {
        openFullLoading();
        try {
          await api_entry_category_save(formData1);
          onClose();
          await submit();
        } catch (error) {}
        closeFullLoading();
      }
      async function handleDel(record: EditRecordRow) {
        openFullLoading();
        try {
          await api_entry_category_del({
            categoryCode: record.categoryCode,
          });
          await submit();
        } catch (error) {}
        closeFullLoading();
      }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
      }
      async function handleSave(record: EditRecordRow) {
        openFullLoading();
        try {
          const data = cloneDeep(record.editValueRefs);
          // 保存之后提交编辑状态
          await api_entry_category_update({
            categoryCode: record.categoryCode,
            categoryName: record.categoryName,
            description: record.description,
            categoryParentCode: record.categoryParentCode,
            keywords: record.keywords,
          });
          const pass = await record.onEdit?.(false, true);
          if (pass) {
            currentEditKeyRef.value = '';
          }
        } catch (error) {}
        closeFullLoading();
      }
      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          if (!record.parent) {
            return [
              {
                label: '新增',
                onClick: handleAdd.bind(null, record),
              },
              {
                label: '编辑',
                disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
                onClick: handleEdit.bind(null, record),
              },
            ];
          } else {
            return [
              {
                label: '新增',
                onClick: handleAdd.bind(null, record),
              },
              {
                label: '编辑',
                disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                disabled: record.children && record.children.length > 0,
                onClick: handleDel.bind(null, record),
              },
            ];
          }
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      return {
        t,
        registerTable,
        registerForm,
        handleSearchInfoFn,
        value,
        createActions,
        visible,
        onClose,
        onSave,
        formData1,
      };
    },
  });
</script>