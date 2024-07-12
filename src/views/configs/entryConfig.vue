<template>
  <PageWrapper :title="t('page.page8.title')">
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
    <Drawer v-model:visible="visible" class="custom-class" title="新增分录" placement="right">
      <Row style="margin-bottom: 1em">
        <Col span="24">分录主名称:</Col>
        <Col span="24">
          <Input v-model:value="formData1.entryName" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">分录名称2:</Col>
        <Col span="24">
          <Input v-model:value="formData1.entryName2" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">分录名称3:</Col>
        <Col span="24">
          <Input v-model:value="formData1.entryName3" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">分录标识:</Col>
        <Col span="24">
          <Input v-model:value="formData1.entryTag" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">描述:</Col>
        <Col span="24">
          <Input v-model:value="formData1.description" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">实现类:</Col>
        <Col span="24">
          <Input v-model:value="formData1.financialComplete" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">内容类:</Col>
        <Col span="24">
          <Input v-model:value="formData1.financialContent" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">方式类:</Col>
        <Col span="24">
          <Input v-model:value="formData1.financialWay" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">科目code:</Col>
        <Col span="24">
          <TreeSelect
            v-model:value="formData1.subjectCode"
            :treeData="treeData"
            style="width: 100%"
          />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">优先级大小:</Col>
        <Col span="24">
          <InputNumber v-model:value="formData1.entryLevel" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">关键词:</Col>
        <Col span="24">
          <Input v-model:value="formData1.keyword" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">关键词2:</Col>
        <Col span="24">
          <Input v-model:value="formData1.keyword2" />
        </Col>
      </Row>
      <Row style="margin-bottom: 1em">
        <Col span="24">关键词3:</Col>
        <Col span="24">
          <Input v-model:value="formData1.keyword3" />
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
  import {
    Alert,
    Card,
    Drawer,
    Row,
    Col,
    Input,
    Select,
    InputNumber,
    TreeSelect,
  } from 'ant-design-vue';
  import type { TreeSelectProps } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    api_entry_cfg_del,
    api_entry_cfg_page,
    api_entry_cfg_save,
    api_entry_subject_page,
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
      Select,
      InputNumber,
      TreeSelect,
    },
    setup() {
      const treeData = ref<TreeSelectProps['treeData']>([
        { label: '资产类', value: '资产类', children: [], selectable: false },
        { label: '负债类', value: '负债类', children: [], selectable: false },
        { label: '权益类', value: '权益类', children: [], selectable: false },
        { label: '收入和利得类', value: '收入和利得类', children: [], selectable: false },
        { label: '费用和损失类', value: '费用和损失类', children: [], selectable: false },
        { label: '管理费用', value: '管理费用', children: [], selectable: false },
        { label: '财务费用', value: '财务费用', children: [], selectable: false },
      ]);

      onMounted(async () => {
        let res = await api_entry_subject_page({ currentPage: 1, pageSize: 10000 });
        res.items.forEach((element) => {
          let selector = treeData.value?.find((i) => i.value === element.subjectCategory);
          if (selector) {
            selector.children.push({
              label: `${element.subjectName}(${element.subjectCode})`,
              value: element.subjectCode,
            });
          }
        });
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
            title: '分录主名称(entryName)',
            dataIndex: 'entryName',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '分录标识(entryTag)',
            dataIndex: 'entryTag',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
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
            title: '实现类(financialComplete)',
            dataIndex: 'financialComplete',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '内容类(financialContent)',
            dataIndex: 'financialContent',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '方式类(financialWay)',
            dataIndex: 'financialWay',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '科目code(subjectCode)',
            dataIndex: 'subjectCode',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '优先级大小(entryLevel)',
            dataIndex: 'entryLevel',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '分录名称2(entryName2)',
            dataIndex: 'entryName2',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '分录名称3(entryName3)',
            dataIndex: 'entryName3',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '关键词(keyword)',
            dataIndex: 'keyword',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '关键词2(keyword2)',
            dataIndex: 'keyword2',
            width: 175,
            align: 'left',
            sorter: true,
            editRow: true,
          },
          {
            title: '关键词3(keyword3)',
            dataIndex: 'keyword3',
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
        entryName: '',
        entryTag: '',
        description: '',
        financialComplete: '',
        financialContent: '',
        financialWay: '',
        subjectCode: '',
        entryLevel: '',
        entryName2: '',
        entryName3: '',
        keyword: '',
        keyword2: '',
        keyword3: '',
      });
      const entryTagOptions = [
        { label: '借', value: 'debit' },
        { label: '贷', value: 'credit' },
      ];
      const options = [
        { label: '借', value: 'debit' },
        { label: '贷', value: 'credit' },
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
          let res = await api_entry_cfg_page({});
          setTableData(res.items);
          setPagination({ current: 1 });
          currentEditKeyRef.value = '';
        } catch (error) {}
        closeFullLoading();
      }
      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.key;
        record.onEdit?.(true);
      }
      function handleAdd(record: EditRecordRow) {
        showDrawer();
        formData1.entryName = '';
        formData1.entryTag = '';
        formData1.description = '';
        formData1.financialComplete = '';
        formData1.financialContent = '';
        formData1.financialWay = '';
        formData1.subjectCode = '';
        formData1.entryLevel = '';
        formData1.entryName2 = '';
        formData1.entryName3 = '';
        formData1.keyword = '';
        formData1.keyword2 = '';
        formData1.keyword3 = '';
      }
      async function onSave() {
        openFullLoading();
        try {
          await api_entry_cfg_save(formData1);
          onClose();
          await submit();
        } catch (error) {}
        closeFullLoading();
      }
      async function handleDel(record: EditRecordRow) {
        openFullLoading();
        try {
          await api_entry_cfg_del({
            id: record.id,
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
          await api_entry_cfg_update({
            id: record.id,
            entryName: record.entryName,
            entryTag: record.entryTag,
            description: record.description,
            financialComplete: record.financialComplete,
            financialContent: record.financialContent,
            financialWay: record.financialWay,
            keyword: record.keyword,
            subjectCode: record.subjectCode,
            description: record.description,
            entryLevel: record.entryLevel,
            entryName2: record.entryName2,
            entryName3: record.entryName3,
            keyword: record.keyword,
            keyword2: record.keyword2,
            keyword3: record.keyword3,
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
        treeData,
      };
    },
  });
</script>