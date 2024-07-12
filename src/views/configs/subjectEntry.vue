<template>
  <PageWrapper :title="'科目配置'">
    <Card>
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn">
        <template #advanceAfter>
          <a-button @click="handleAdd">新增</a-button>
        </template>
      </BasicForm>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record, column)" />
          </template>
        </template>
      </BasicTable>
    </Card>
    <Drawer v-model:visible="visible" class="custom-class" title="新增科目" placement="right">
      <Row style="margin-bottom: 1em">
        <Col span="24">科目大类: </Col>
        <Col span="24">
          <Select
            v-model:value="formData1.subjectCategory"
            :options="options"
            style="width: 100%"
          />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目code: </Col>
        <Col span="24">
          <Input v-model:value="formData1.subjectCode" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">描述: </Col>
        <Col span="24">
          <Input v-model:value="formData1.description" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目名称: </Col>
        <Col span="24">
          <Input v-model:value="formData1.subjectName" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目名称2: </Col>
        <Col span="24">
          <Input v-model:value="formData1.subjectName2" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目名称3: </Col>
        <Col span="24">
          <Input v-model:value="formData1.subjectName3" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目名称4: </Col>
        <Col span="24">
          <Input v-model:value="formData1.subjectName4" />
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
  import { Alert, Card, Drawer, Row, Col, Input, Select } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { api_entry_subject_del, api_entry_subject_page, api_entry_subject_save } from '/@/api';

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
      Select,
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
            title: '科目大类(subjectCategory)',
            dataIndex: 'subjectCategory',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '科目code(subjectCode)',
            dataIndex: 'subjectCode',
            width: 175,
            align: 'left',
            sorter: true,
          },
          {
            title: '描述(description)',
            dataIndex: 'description',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '科目名称(subjectName)',
            dataIndex: 'subjectName',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '科目名称2(subjectName2)',
            dataIndex: 'subjectName2',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '科目名称3(subjectName3)',
            dataIndex: 'subjectName3',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '科目名称4(subjectName4)',
            dataIndex: 'subjectName4',
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
      const value = ref<string>();
      const currentEditKeyRef = ref('');
      const visible = ref<boolean>(false);
      const formData1 = reactive({
        subjectCategory: '',
        subjectCode: '',
        description: '',
        subjectName: '',
        subjectName2: '',
        subjectName3: '',
        subjectName4: '',
      });
      const options = [
        { label: '资产类', value: '资产类' },
        { label: '负债类', value: '负债类' },
        { label: '权益类', value: '权益类' },
        { label: '收入和利得类', value: '收入和利得类' },
        { label: '费用和损失类', value: '费用和损失类' },
        { label: '管理费用', value: '管理费用' },
        { label: '财务费用', value: '财务费用' },
      ];
      const showDrawer = () => {
        visible.value = true;
      };
      const onClose = () => {
        visible.value = false;
      };

      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let res = await api_entry_subject_page({});
          setTableData(res.items);
          setPagination({ current: 1 });
        } catch (error) {}
        closeFullLoading();
      }
      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.key;
        record.onEdit?.(true);
      }
      function handleAdd(record: EditRecordRow) {
        showDrawer();
        formData1.subjectCategory = '';
        formData1.subjectCode = '';
        formData1.description = '';
        formData1.subjectName = '';
        formData1.subjectName2 = '';
        formData1.subjectName3 = '';
        formData1.subjectName4 = '';
      }
      async function onSave() {
        openFullLoading();
        try {
          await api_entry_subject_save(formData1);
          onClose();
          await submit();
        } catch (error) {}
        closeFullLoading();
      }
      async function handleDel(record: EditRecordRow) {
        openFullLoading();
        try {
          await api_entry_subject_del({
            subjectCode: record.subjectCode,
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
          return [
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
        options,
        handleAdd,
      };
    },
  });
</script>