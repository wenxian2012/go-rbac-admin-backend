<template>
  <div class="wrapper">
    <div class="search-form">
      <a-row type="flex" align="middle">
        <a-col class="col-input">
          <a-input
            v-model="search.name"
            placeholder="请输入: 角色名"
            @keyup.enter="getDataSource"
          />
        </a-col>
        <a-col class="col-button">
          <a-button type="primary" @click="getDataSource">搜索</a-button>
          <a-button @click="onReset()">重置</a-button>
        </a-col>
        <a-col class="flex-r">
          <a-button type="primary" icon="edit" @click="() => showModal(null)">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      class="global-ant-table"
      :loading="loading"
      :columns="tableColumns"
      :dataSource="dataSource"
      :rowKey="row => row.id"
      :pagination="pagination"
      @change="tableChange"
    >
      <template slot="action" slot-scope="record" class="action">
        <a href="javascript:;" @click="() => showModal(record)"> <a-icon type="edit" /> 编辑 </a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除该记录吗？"
          okText="确定"
          cancelText="取消"
          @confirm="() => onDelete(record)"
        >
          <a href="javascript:;"> <a-icon type="delete" /> 删除 </a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      :width="'800px'"
      :title="modalIsCreate ? '新增角色' : '编辑角色'"
      :visible="modalVisible"
      :confirmLoading="modalConfirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" class="ui-small-form">
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="角色名">
              <a-input
                v-decorator="[
                  'name',
                  {
                    initialValue: currentRecord ? currentRecord.name : null,
                    rules: [{ required: true, message: '角色名不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="备注">
              <a-input
                v-decorator="[
                  'memo',
                  {
                    initialValue: currentRecord ? currentRecord.memo : null,
                    rules: [],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider orientation="left">选择菜单权限</a-divider>
        <a-table
          v-if="menusTree.length"
          class="global-ant-table role-menus-table"
          defaultExpandAllRows
          bordered
          :columns="[
            {
              title: '菜单名称',
              dataIndex: 'name',
              key: 'name',
              width: '25%',
              scopedSlots: { customRender: 'name' },
            },
            {
              title: '动作权限',
              dataIndex: 'actions',
              key: 'actions',
              width: '35%',
              scopedSlots: { customRender: 'actions' },
            },
            {
              title: '资源权限',
              dataIndex: 'resources',
              key: 'resources',
              scopedSlots: { customRender: 'resources' },
            },
          ]"
          :dataSource="menusTree"
          :rowKey="row => row.id"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onSelect: onSelected,
            onSelectAll: onSelectAll,
          }"
          :pagination="false"
        >
          <template slot="name" slot-scope="text, record" class="menu-name">
            <span v-if="record._isLeaf">└─ {{ text }}</span>
            <span v-else>├─ {{ text }}</span>
          </template>
          <template slot="actions" slot-scope="value, record">
            <a-row v-if="value.length">
              <a-col v-for="v in value" :key="v.id" :span="24" style="margin: 1px 0;">
                <a-checkbox
                  :checked="v.checked"
                  :value="v.id"
                  @change="e => onActionCheckChange(e, v, record)"
                >
                  {{ v.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </template>
          <template slot="resources" slot-scope="value, record">
            <a-row v-if="value.length">
              <a-col v-for="v in value" :key="v.id" :span="24" style="margin: 1px 0;">
                <a-checkbox
                  :checked="v.checked"
                  :value="v.id"
                  @change="e => onResourceCheckChange(e, v, record)"
                >
                  {{ v.name }}
                </a-checkbox>
              </a-col>
            </a-row>
          </template>
        </a-table>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.role-menus-table /deep/ .ant-table-row td:nth-child(3) {
  vertical-align: top;
}
</style>

<script>
import request from '@/utils/request';
import queryString from 'query-string';
const tableColumns = [
  {
    title: '角色名',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
    width: '30%',
    customRender: text => {
      return text || '--';
    },
  },
  {
    title: '最后更新',
    key: 'updated_at',
    dataIndex: 'updated_at',
    width: '20%',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '20%',
  },
];
export default {
  data() {
    return {
      loading: false,
      dataSource: [],
      menusTree: [],
      cloneMenusTree: [],
      tableColumns,
      pagination: {
        size: 'small',
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        pageIndex: 1,
        pageSize: 20,
      },
      search: {
        name: null,
      },
      currentRecord: null,
      modalIsCreate: true,
      modalVisible: false,
      modalConfirmLoading: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      tailFormItemLayout: {
        wrapperCol: { span: 16, offset: 8 },
      },
    };
  },
  computed: {
    selectedRowKeys: function() {
      return this.getSelectedRowKeys();
    },
  },
  mounted() {
    this.getDataSource();
    request({
      url: `/api/v1/menus-tree`,
      method: 'GET',
    }).then(resp => {
      const fn1 = list => {
        for (const key in list) {
          const item = list[key];
          if (item.children.length) {
            item.isLeaf = false;
            fn1(item.children);
          } else {
            if (item.parent_id) {
              item.children = null;
            }
            item._isLeaf = parseInt(key) === list.length - 1;
          }
          item.checked = false;
          item.actions = item.actions.map(t => {
            t.checked = false;
            return t;
          });
          item.resources = item.resources.map(t => {
            t.checked = false;
            return t;
          });
        }
      };
      fn1(resp);
      this.menusTree = resp;
      this.cloneMenusTree = JSON.parse(JSON.stringify(resp));
    });
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'role' });
  },
  methods: {
    getDataSource() {
      const { pageIndex, pageSize } = this.pagination;
      const searchParams = queryString.stringify(this.search, { skipNull: true });
      this.loading = true;
      request({
        url: `/api/v1/roles${searchParams ? '?' + searchParams : ''}`,
        method: 'GET',
        params: { pageIndex, pageSize },
      })
        .then(resp => {
          const { total, pageIndex, pageSize } = resp.pagination;
          this.dataSource = resp.list;
          this.pagination = { ...this.pagination, total, pageIndex, pageSize };
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    onReset() {
      this.search = {
        name: null,
      };
      this.getDataSource();
    },
    /**
     * 删除记录
     */
    onDelete(e) {
      const id = e.id;
      request({
        url: '/api/v1/roles/' + id,
        method: 'DELETE',
      })
        .then(resp => {
          this.$message.success('删除成功');
          this.getDataSource();
        })
        .catch(err => {});
    },
    /**
     * table 分页处理
     */
    tableChange(pagination, filters, sorter) {
      const { current, pageSize } = pagination;
      this.pagination.pageIndex = current;
      this.pagination.pageSize = pageSize;
      this.getDataSource();
    },
    /**
     * 打开Modal
     */
    showModal(record) {
      this.menusTree = JSON.parse(JSON.stringify(this.cloneMenusTree));
      this.modalIsCreate = !record;
      if (record) {
        const keys = record.role_menus.map(t => t.menu_id);
        const fn1 = list => {
          for (const item of list) {
            if (item.children && item.children.length) {
              fn1(item.children);
            }
            if (keys.includes(item.id)) {
              const find = record.role_menus.find(t => t.menu_id === item.id);
              if (!find) {
                throw new Error('异常的错误');
              }
              let { id, actions, resources } = find;
              actions = actions.map(t => parseInt(t));
              resources = resources.map(t => parseInt(t));
              item.role_menu_id = id;
              item.checked = true;
              item.actions.forEach(t => {
                if (actions.includes(t.id)) {
                  t.checked = true;
                }
              });
              item.resources.forEach(t => {
                if (resources.includes(t.id)) {
                  t.checked = true;
                }
              });
            }
          }
        };
        fn1(this.menusTree);
        this.currentRecord = record;
      }
      this.modalVisible = true;
    },
    /**
     * 提交Modal
     */
    handleOk(e) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { name, memo } = values;
          const role_menus = [];
          const fn1 = list => {
            for (const record of list) {
              if (record.children && record.children.length) {
                fn1(record.children);
              }
              if (record.checked) {
                const item = {
                  id: this.modalIsCreate ? null : record.role_menu_id || null,
                  menu_id: record.id,
                  actions: record.actions.filter(t => t.checked).map(t => t.id + ''),
                  resources: record.resources.filter(t => t.checked).map(t => t.id + ''),
                };
                role_menus.push(item);
              }
            }
          };
          fn1(this.menusTree);
          if (!role_menus.length) {
            this.$message.error('菜单权限不能为空');
            return;
          }

          this.modalConfirmLoading = true;
          const data = {
            name,
            memo,
            role_menus,
          };
          request({
            url: this.modalIsCreate ? '/api/v1/roles' : '/api/v1/roles/' + this.currentRecord.id,
            method: this.modalIsCreate ? 'POST' : 'PUT',
            data,
          })
            .then(resp => {
              this.modalConfirmLoading = false;
              this.modalVisible = false;
              this.$message.success(this.modalIsCreate ? '新增成功' : '更新成功');
              this.getDataSource();
              this.currentRecord = null;
              this.form.resetFields();
            })
            .catch(err => {
              this.modalConfirmLoading = false;
              this.form.resetFields();
            });
        }
      });
    },
    getSelectedRowKeys() {
      const keys = [];
      const fn1 = list => {
        for (const item of list) {
          if (item.children && item.children.length) {
            fn1(item.children);
          }
          if (item.checked) {
            keys.push(item.id);
          }
        }
      };
      fn1(this.menusTree);
      return keys;
    },
    onSelected(record, selected) {
      record.checked = selected;
      const fn1 = record => {
        let v = true;
        if (record.children && record.children.length) {
          for (let i = 0; i < record.children.length; i++) {
            const item = record.children[i];
            v = fn1(item);
            if (!v) {
              break;
            }
          }
        }
        return v
          ? !record.actions.find(t => t.checked) && !record.resources.find(t => t.checked)
          : v;
      };
      const checkAll = record => {
        if (record.children && record.children.length) {
          for (const item of record.children) {
            checkAll(item);
          }
        }
        if (!record.disabled) {
          record.checked = selected;
        }
        record.actions = record.actions.map(t => {
          if (!t.disabled) {
            t.checked = selected;
          }
          return t;
        });
        record.resources = record.resources.map(t => {
          if (!t.disabled) {
            t.checked = selected;
          }
          return t;
        });
      };
      if (selected) {
        if (fn1(record)) {
          checkAll(record);
        }
      }
      if (!selected) {
        checkAll(record);
      }
    },
    onSelectAll(selected) {
      const fn1 = list => {
        for (const item of list) {
          if (item.children && item.children.length) {
            fn1(item.children);
          }
          item.checked = selected;
          item.actions = item.actions.map(t => {
            if (!t.disabled) {
              t.checked = selected;
            }
            return t;
          });
          item.resources = item.resources.map(t => {
            if (!t.disabled) {
              t.checked = selected;
            }
            return t;
          });
        }
      };
      fn1(this.menusTree);
    },
    onActionCheckChange(event, item, record) {
      const checked = event.target.checked;
      const parints = record.parent_path.split('/').map(t => parseInt(t));
      const find = this.menusTree.find(t => t.id === parints[0]);
      if (checked) {
        item.checked = checked;
        record.checked = checked;
        const fn1 = rr => {
          if (rr.children && rr.children.length) {
            for (const tt of rr.children) {
              fn1(tt);
            }
          }
          if (parints.includes(rr.id)) {
            rr.checked = checked;
          }
        };
        if (find) {
          fn1(find);
        }
      } else {
        const parintsItem = [];
        item.checked = checked;
        const v = !!record.actions.find(t => t.checked) || !!record.resources.find(t => t.checked);
        record.checked = v;
        const fn1 = rr => {
          if (rr.children && rr.children.length) {
            for (const tt of rr.children) {
              if (tt.id === record.id) {
                break;
              }
              fn1(tt);
            }
          }
          if (parints.includes(rr.id)) {
            parintsItem.push(rr);
          }
        };
        if (find) {
          fn1(find);
          for (const tt of parintsItem) {
            tt.checked = !!tt.actions.find(t => t.checked) || !!tt.resources.find(t => t.checked);
            if (tt.checked) {
              break;
            }
          }
        }
      }
    },
    onResourceCheckChange(event, item, record) {
      this.onActionCheckChange(event, item, record);
    },
    /**
     * 关闭Modal
     */
    handleCancel(e) {
      this.modalVisible = false;
      this.currentRecord = null;
      this.form.resetFields();
    },
  },
};
</script>
