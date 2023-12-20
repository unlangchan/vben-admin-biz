<template>
  <BasicTable @register="registerTable">
    <template #form-custom> custom-slot </template>
    <template #headerTop>
      <a-alert type="info" show-icon>
        <template #message>
          <template v-if="checkedKeys.length > 0">
            <span>已选中{{ checkedKeys.length }}条记录(可跨页)</span>
            <a-button type="link" @click="checkedKeys = []" size="small">清空</a-button>
          </template>
          <template v-else>
            <span>未选中任何项目</span>
          </template>
        </template>
      </a-alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="getFormValues">获取表单数据</a-button>
    </template>
    <template #form-formFooter>
      <div class="extendActionBox">
        <a-button type="primary" @click="getFormValues">新增</a-button>
        <a-button type="primary" @click="getFormValues">申请删除</a-button>
        <a-button type="primary" @click="getFormValues">导出EXCEL</a-button>
        <a-button type="danger" @click="getFormValues">一键校验</a-button>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <TableAction
          :actions="[
            {
              label: '查看',
              icon: 'ic:outline-library-books',
              onClick: handleDelete.bind(null, record),
            },
            {
              label: '编辑',
              icon: 'ic:round-edit-note',
              onClick: handleDelete.bind(null, record),
            },
          ]"
          :dropDownActions="[
            //    {
            //      label: '启用',
            //      popConfirm: {
            //        title: '是否启用？',
            //        confirm: handleOpen.bind(null, record),
            //      },
            //    },
          ]"
        />
      </template>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  /**
   * 通用查询模板
   */
  import { defineComponent, onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getBasicColumns, getFormConfig } from './tableData';
  import { Alert } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getPageInfo } from '/@/pages/index';

  const { t } = useI18n();

  import { api_0001 } from '/@/api/index';

  export default defineComponent({
    components: { BasicTable, AAlert: Alert, TableAction },
    setup() {
      const { currentRoute } = useRouter();
      const checkedKeys = ref<Array<string | number>>([]);
      let config = getPageInfo(currentRoute.value.name);
      const [registerTable, { getForm }] = useTable({
        title: t(currentRoute.value.meta.title),
        useSearchForm: true,
        beforeFetch: function (params) {
          let res = {};
          for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
              const element = params[key];
              if (element instanceof Array) {
                res[key] = element.join(' - ');
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
        ...config,
      });

      function getFormValues() {
        console.log(getForm().getFieldsValue());
      }

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
      function handleDelete(record: Recordable) {
        console.log('点击了删除', record);
      }
      function handleOpen(record: Recordable) {
        console.log('点击了启用', record);
      }
      return {
        registerTable,
        getFormValues,
        checkedKeys,
        onSelect,
        onSelectAll,
        handleDelete,
        handleOpen,
      };
    },
  });
</script>
