<template>
  <PageWrapper :title="t('page.page1.title')">
    <Card><span v-bind:innerHTML="description"></span></Card>
    <Card class="mt-4">
      <Row>
        <Col flex="auto">
          <Mentions
            v-model:value="formData1.value"
            autofocus
            :options="formData1.options"
            :prefix="formData1.prefix"
            :split="''"
            :validateSearch="validateSearch"
            :placeholder="t('page.page1.mentionsPlaceholder')"
            @change="searchHandler1"
            @select="selectHandler1"
          />
        </Col>
        <Col flex="100px" style="margin-left: 10px">
          <Button type="primary" @click="save">{{ t('page.save') }}</Button>
        </Col>
      </Row>
      <div class="mt-2">
        <Tag v-for="(item, key) of formData1.words" :key="key" :color="item.color">{{
          item.value
        }}</Tag>
      </div>
    </Card>
    <CollapseContainer :title="t('page.page1.historicalInputQuery')" class="mt-4">
      <BasicTable @register="registerTable">
        <template #form-custom> custom-slot </template>
        <template #headerTop>
          <a-alert type="info" show-icon>
            <template #message>
              <template v-if="checkedKeys.length > 0">
                <span>{{ t('page.selectedTip', [checkedKeys.length]) }}</span>
                <a-button type="link" @click="checkedKeys = []" size="small">{{
                  t('page.clear')
                }}</a-button>
              </template>
              <template v-else>
                <span>{{ t('page.unSelectedTip') }}</span>
              </template>
            </template>
          </a-alert>
        </template>
        <template #form-formFooter>
          <div class="extendActionBox">
            <a-button type="danger" @click="handleDelete">{{ t('page.page1.remove') }}</a-button>
          </div>
        </template>
      </BasicTable>
    </CollapseContainer>
    <CollapseContainer :title="t('page.page1.summaryReport')" class="mt-4">
      <SummaryReport />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  // 示例页
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  import { CollapseContainer } from '/@/components/Container';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Alert, Card, Mentions, Tag, Row, Col, Button } from 'ant-design-vue';
  import {
    api_content_delete,
    api_content_list,
    api_description,
    api_keyword,
    api_saveContent,
  } from '/@/api';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import SummaryReport from './components/summaryReport.vue';
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLocale } from '/@/locales/useLocale';
  import { LOCALE } from '/@/settings/localeSetting';
  const lang = useLocale().getLocale.value;
  const { createMessage } = useMessage();
  const { t } = useI18n();

  export default defineComponent({
    components: {
      CollapseContainer,
      PageWrapper,
      Card,
      Mentions,
      Tag,
      Row,
      Col,
      Button,
      BasicTable,
      AAlert: Alert,
      TableAction,
      SummaryReport,
    },
    setup() {
      const formData1 = reactive({
        value: '',
        options: [],
        source: [],
        prefix: [],
        words: [],
        keywords: [[], [], []],
        _options: [],
      });
      const description = ref('');
      getDescription();
      getkeyword();
      /** Historical input query S */
      const checkedKeys = ref<Array<string | number>>([]);
      const [registerTable, { getForm }] = useTable({
        // title: t('page.page1.historicalInputQuery'),
        useSearchForm: true,
        scroll: { y: '100%' },
        beforeFetch: function (params) {
          let res = {};
          for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              const element = params[key];
              if (element instanceof Array) {
                if (key === 'time') {
                  res['startTime'] = element[0];
                  res['endTime'] = element[1];
                }
              } else {
                res[key] = element;
              }
            }
          }
          return res;
        },
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        showIndexColumn: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: checkedKeys,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
        },
        api: api_content_list,
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 80,
          },
          {
            title: t('page.page1.colums.content'),
            dataIndex: 'content',
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
            title: t('page.page1.colums.financialComplete'),
            dataIndex: 'financialComplete',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: t('page.page1.colums.financialContent'),
            dataIndex: 'financialContent',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: t('page.page1.colums.financialWay'),
            dataIndex: 'financialWay',
            width: 150,
            align: 'left',
            sorter: true,
          },
          {
            title: t('page.page1.colums.createTime'),
            dataIndex: 'createTime',
            width: 250,
            sorter: true,
          },
        ],
        formConfig: {
          labelWidth: '12em',
          model: {
            searchText: '',
            time: [
              moment().subtract(30, 'd').format('YYYY-MM-DD 00:00:00'),
              moment().add(1, 'd').format('YYYY-MM-DD 00:00:00'),
            ],
          },
          schemas: [
            {
              field: `searchText`,
              label: t('page.page1.colums.searchText'),
              component: 'Input',
              colProps: {
                xl: 12,
                xxl: 8,
              },
              componentProps: {
                placeholder: t('page.page1.searchTextPlaceholder'),
              },
            },
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
      function onSelect(record, selected) {
        if (selected) {
          checkedKeys.value = [...checkedKeys.value, record.id];
        } else {
          checkedKeys.value = checkedKeys.value.filter((id) => id !== record.id);
        }
      }
      function onSelectAll(selected, selectedRows, changeRows) {
        const changeIds = changeRows.map((item) => item.id);
        if (selected) {
          checkedKeys.value = [...checkedKeys.value, ...changeIds];
        } else {
          checkedKeys.value = checkedKeys.value.filter((id) => {
            return !changeIds.includes(id);
          });
        }
      }
      async function handleDelete() {
        let ids = checkedKeys.value;
        if (ids.length === 0) {
          createMessage.warn(t('sys.api.operationWarn1'));
          return;
        }
        await api_content_delete(ids);
        checkedKeys.value = [];
        createMessage.success(t('sys.api.operationSuccess'));
        // reload
        getForm().submit();
      }
      /** Historical input query E */
      /** Summary reporty S */
      /** Summary report E */
      // Other
      async function getDescription() {
        const data = await api_description();
        description.value = data;
      }
      async function getkeyword() {
        const data = await api_keyword();
        formData1.source = data;
        formData1.keywords = ['financial_complete', 'financial_content', 'financial_way'].map((key) =>
          data[key].map((i) => i.keywordName.toLowerCase().trim()),
        );
        formData1.options = [].concat(...formData1.keywords).map((i) => {
          return { label: i, value: i };
        });
        formData1._options = formData1.options;
        let words = [].concat(...formData1.keywords);
        let map1 = new Map();
        for (let index1 = 0; index1 < words.length; index1++) {
          const element = words[index1];
          map1.set(element[0], '');
        }
        let wordKeys = Array.from(map1.keys());
        if (lang === LOCALE.EN_UE) {
          formData1.prefix = ['@'].concat(
            wordKeys,
            wordKeys.map((i: string) => i.toUpperCase()),
          );
        } else {
          formData1.prefix = ['@'].concat(wordKeys);
        }
      }
      function validateSearch(text: string, props: MentionsProps) {
        let prefix = props.value.slice(-1).toLowerCase();
        let keywordIndex = props.value.indexOf('@');
        if (prefix === '@') {
          formData1.options = formData1._options;
        } else if (keywordIndex > -1) {
          prefix = props.value.slice(keywordIndex + 1, keywordIndex + 2);
          formData1.options = formData1._options.filter((i) => i.value[0] === prefix);
        } else {
          formData1.options = formData1._options.filter((i) => i.value[0] === prefix);
        }
        if (formData1.options.length !== 0) {
          return true;
        }
      }
      function searchHandler1(value: string) {
        let str = value.toLowerCase().trim();
        let words = [];
        for (let index = 0; index < formData1.keywords.length; index++) {
          const arr = formData1.keywords[index];
          let result = [];
          for (let i = 0; i < arr.length; i++) {
            const keywordName = arr[i];
            if (str.indexOf(keywordName) > -1) {
              if (result.length === 0) {
                // 首个匹配项
                result.push({ value: keywordName });
              } else {
                for (let j = 0; j < result.length; j++) {
                  if (keywordName.indexOf(result[j].value) > -1) {
                    // 当前关键字包含存在的关键字
                    result[j] = { value: keywordName };
                  } else if (result[j].value.indexOf(keywordName) > -1) {
                    // 当前关键字被包含
                  } else if (j === result.length - 1) {
                    // 以上条件不成立 但当前关键字不存在关键字列表
                    result.push({ value: keywordName });
                  }
                }
              }
            }
          }
          if (result.length > 1) {
            for (let j = 0; j < result.length; j++) {
              result[j].color = 'error';
            }
          }
          words = words.concat(result);
        }
        words = words.concat(
          (str.match(/\d+(\.\d+)?/g) || []).map((i) => {
            return {
              value: i,
              color: 'blue',
            };
          }),
        );
        formData1.words = words;
        formData1.options = formData1._options;
      }
      function selectHandler1(option: OptionProps, prefix: string) {
        let lastStr = prefix + option.value;
        let keywordIndex = formData1.value.indexOf('@');
        if (keywordIndex > -1) {
          console.log('keywordIndex :>> ', keywordIndex);
          formData1.value = formData1.value.replace(/(@.*)/gi, option.value);
          return;
        }
        let str = formData1.value.slice(0, -lastStr.length);
        formData1.value = str + lastStr.slice(1);
      }
      async function save() {
        let res = await api_saveContent({
          content: formData1.value,
        });
        createMessage.success(t('sys.api.operationSuccess'));
        // reload
        getForm().submit();
      }

      return {
        t,
        description,
        formData1,
        searchHandler1,
        selectHandler1,
        validateSearch,
        save,
        /** Historical input query S */
        registerTable,
        checkedKeys,
        onSelect,
        onSelectAll,
        handleDelete,
        /** Historical input query E */
      };
    },
  });
</script>
<style scoped>
  .ant-card.mt-4 {
    margin-top: 1rem;
  }
  .ant-mentions {
    border-color: #4096ff;
  }
</style>