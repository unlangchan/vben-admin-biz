<template>
  <PageWrapper :title="t('page.page4.title')">
    <Card class="mt-4">
      <Row>
        <Col flex="auto">
          <Textarea
            v-model:value="formData1.value"
            :placeholder="t('page.page4.textareaPlaceholder')"
            :auto-size="{ minRows: 5, maxRows: 10 }"
            @keydown="keydownHandler"
          />
        </Col>
        <Col flex="100px" style="margin-left: 10px">
          <Button type="primary" @click="save">{{ t('page.save') }}</Button>
        </Col>
      </Row>
      <div class="mt-2" v-if="formData1.errorInfoList.length > 0">
        <Tag v-for="(item, key) of formData1.errorInfoList" :key="key" color="error">{{
          `${item.errorInfo}`
        }}</Tag>
      </div>
    </Card>
    <Card class="mt-4">
      <BasicForm submitOnReset @register="registerForm" @submit="handleSearchInfoFn"> </BasicForm>
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'content'">
            <div class="columStyle2">{{ text }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'debit'">
            <div class="columStyle1">{{ text }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'credit'">
            <div class="columStyle1">{{ text }}</div>
          </template>
        </template>
      </BasicTable>
    </Card>
  </PageWrapper>
</template>
<script lang="ts">
  // Financial transactions
  import { defineComponent, onMounted, reactive } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import {
    Alert,
    Card,
    Upload,
    Row,
    Col,
    Textarea,
    Button,
    Tag,
    TableColumn,
    TableColumnGroup,
    InputProps,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { api_entry_content_list, api_entry_parse } from '/@/api';

  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Loading, useLoading } from '/@/components/Loading';
  import { useMessage } from '/@/hooks/web/useMessage';
  import moment from 'moment';
  import { error } from 'console';
  const { createMessage } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      PageWrapper,
      BasicForm,
      BasicTable,
      AAlert: Alert,
      Textarea,
      Card,
      Upload,
      Row,
      Col,
      Button,
      Tag,
      TableColumn,
      TableColumnGroup,
    },
    setup() {
      const formData1 = reactive({
        value: '',
        errorInfoList: [],
      });

      onMounted(async () => {
        handleSearchInfoFn({
          time: [
            moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
            moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
          ],
        });
      });

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: t('page.loading'),
      });

      const [registerForm, { submit }] = useForm({
        actionColOptions: {
          span: 12,
          xl: 12,
          xxl: 12,
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
      const [registerTable, { setTableData, setPagination }] = useTable({
        scroll: { y: 'auto' },
        useSearchForm: false,
        tableSetting: { fullScreen: true },
        showTableSetting: true,
        showIndexColumn: false,
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 80,
          },
          {
            title: t('page.page4.colums.content'),
            dataIndex: 'content',
            width: 600,
            align: 'left',
            sorter: true,
          },
          {
            title: 'Debit',
            dataIndex: 'debit',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: 'Credit',
            dataIndex: 'credit',
            width: 250,
            align: 'left',
            sorter: true,
          },
          {
            title: t('page.page4.colums.currency'),
            dataIndex: 'currency',
            width: 250,
            sorter: true,
          },
          {
            title: t('page.page4.colums.transactionTime'),
            dataIndex: 'transactionTime',
            width: 250,
            sorter: true,
          },
        ],
      });
      async function handleSearchInfoFn(params) {
        openFullLoading();
        try {
          let inParams = {};
          for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              const element = params[key];
              if (element instanceof Array) {
                if (key === 'time') {
                  inParams['startTime'] = element[0];
                  inParams['endTime'] = element[1];
                }
              } else {
                inParams[key] = element;
              }
            }
          }
          let res = await api_entry_content_list(inParams);
          let data = res.items.map((item) => {
            let DrList = item.reports
              .filter((i) => i.reportTag === 'debit')
              .map((i) => {
                return `${i.reportField}: ${i.amount}`;
              });
            let CrList = item.reports
              .filter((i) => i.reportTag === 'credit')
              .map((i) => {
                return `${i.reportField}: ${i.amount}`;
              });
            let result = {
              ...item,
              debit: `${DrList.join('\n')}`,
              credit: `${CrList.join('\n')}`,
            };

            return result;
          });
          setTableData(data);
          setPagination({ current: 1 });
        } catch (error) {}
        closeFullLoading();
      }
      async function save() {
        let formData = new FormData();
        formData.append('text', formData1.value);
        formData1.errorInfoList = [];
        let data = await api_entry_parse(formData);
        if (data.errorInfoList.length > 0) {
          formData1.errorInfoList = data.errorInfoList.map((item) => {
            if (item.content !== formData1.value) {
              item.errorInfo = `${item.content}: ${item.errorInfo}`;
            }
            return item;
          });
          createMessage.warning(t('sys.api.operationFailed'));
        } else {
          createMessage.success(t('sys.api.operationSuccess'));
          formData1.value = '';
          formData1.errorInfoList = [];
          submit();
        }
      }
      let keyCodeStack = [];
      function injectEnd(e) {
        let elem = e.target;
        let startTarget = elem.selectionStart;
        let endTarget = elem.selectionEnd;
        let oldText = elem.value;
        let startText: String = oldText.substring(0, startTarget);
        startText = startText.trim();
        if (startText.slice(-1) !== '.') {
          startText += '.';
        }
        let result = startText + oldText.substring(endTarget);
        elem.value = result;
        elem.focus();
        let newFocusIndex = startText.length;
        elem.selectionStart = newFocusIndex;
        elem.selectionEnd = newFocusIndex;
      }
      function injectBreak(e) {
        let elem = e.target;
        let startTarget = elem.selectionStart;
        let endTarget = elem.selectionEnd;
        let oldText = elem.value;
        let startText: String = oldText.substring(0, startTarget);
        startText = startText.trim();
        if (startText.slice(-2).indexOf(',') === -1) {
          startText += ', ';
        }
        let result = startText + oldText.substring(endTarget);
        elem.value = result;
        elem.focus();
        let newFocusIndex = startText.length;
        elem.selectionStart = newFocusIndex;
        elem.selectionEnd = newFocusIndex;
      }
      function keydownHandler(e: KeyboardEvent) {
        keyCodeStack.push(e.keyCode);
        keyCodeStack = keyCodeStack.slice(-5);
        console.log(e);
        if (e.keyCode === 13) {
          injectEnd(e);
        } else if (e.keyCode === 32) {
          if (keyCodeStack[keyCodeStack.length - 1] === keyCodeStack[keyCodeStack.length - 2]) {
            injectBreak(e);
          }
        }
      }

      return {
        t,
        registerTable,
        registerForm,
        handleSearchInfoFn,
        formData1,
        save,
        keydownHandler,
      };
    },
  });
</script>
<style scoped>
  .ant-card.mt-4 {
    margin-top: 1rem;
  }
  .columStyle1 {
    word-break: break-all;
    white-space: pre;
  }
  .columStyle2 {
    white-space: normal;
  }
</style>