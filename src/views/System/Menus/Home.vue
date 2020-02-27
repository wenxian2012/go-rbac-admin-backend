<template>
  <div class="wrapper">
    <div class="search-form">
      <a-row type="flex" align="middle">
        <a-col class="col-input">
          <a-input v-model="search.name" placeholder="请输入: 菜单名称" @keyup.enter="onSearch" />
        </a-col>
        <a-col class="col-button">
          <a-button type="primary" @click="onSearch">搜索</a-button>
          <a-button @click="onReset">重置</a-button>
        </a-col>
        <a-col class="flex-r">
          <a-button type="primary" icon="edit" @click="showModal(null)">新增</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      v-if="dataSource.length"
      class="global-ant-table"
      :loading="loading"
      :columns="tableColumns"
      :dataSource="dataSource"
      :rowKey="row => row.id"
      defaultExpandAllRows
      :pagination="false"
    >
      <template slot="name" slot-scope="text, record" class="menu-name">
        <span v-if="record._isLeaf">└─ {{ text }}</span>
        <span v-else>├─ {{ text }}</span>
      </template>
      <template slot="icon" slot-scope="icon">
        <a-icon :type="icon" />
        {{ icon }}
      </template>
      <template slot="hidden" slot-scope="hidden">
        <a-tag :color="hidden === 0 ? 'green' : 'pink'">{{ hidden === 0 ? '显示' : '隐藏' }}</a-tag>
      </template>
      <template slot="action" slot-scope="record" class="action">
        <a href="javascript:;" @click="showModal(record)"> <a-icon type="edit" /> 编辑 </a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除该记录吗？"
          okText="确定"
          cancelText="取消"
          @confirm="onDelete(record)"
        >
          <a href="javascript:;"> <a-icon type="delete" /> 删除 </a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      :title="modalIsCreate ? '新增菜单' : '编辑菜单'"
      :width="840"
      :visible="modalVisible"
      :confirmLoading="modalConfirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
        class="ui-small-form ant-of-inline"
        :class="{ 'ant-form-has-error': formHasError }"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="菜单名称">
              <a-input
                v-decorator="[
                  'name',
                  {
                    initialValue: currentRecord ? currentRecord.name : null,
                    rules: [{ required: true, message: '菜单名称不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="上级菜单">
              <a-tree-select
                v-decorator="[
                  'parent_id',
                  {
                    initialValue:
                      currentRecord && currentRecord.parent_id ? currentRecord.parent_id : null,
                    rules: [],
                  },
                ]"
                allowClear
                placeholder="默认根菜单"
                :treeData="treeDataSource"
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="菜单图标">
              <a-input
                v-decorator="[
                  'icon',
                  {
                    initialValue: currentRecord ? currentRecord.icon : null,
                    rules: [{ required: true, message: '菜单图标不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="访问路由">
              <a-input
                v-decorator="[
                  'router',
                  {
                    initialValue: currentRecord ? currentRecord.router : null,
                    rules: [{ required: true, message: '访问路由不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="排序值">
              <a-input-number
                v-decorator="[
                  'sequence',
                  {
                    initialValue: currentRecord ? currentRecord.sequence : 10000,
                    rules: [{ required: true, message: '排序值不能为空' }],
                  },
                ]"
                :min="1"
                style="width: 100%"
                type="text"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item v-bind="formItemLayout" label="显示状态">
              <a-radio-group
                v-decorator="[
                  'hidden',
                  {
                    initialValue: currentRecord ? currentRecord.hidden : 0,
                    rules: [{ required: true, message: '显示状态不能为空' }],
                  },
                ]"
              >
                <a-radio :value="0">显示</a-radio>
                <a-radio :value="1">隐藏</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="divider-wrapper">
          <a-divider orientation="left">资源管理</a-divider>
          <div class="buttons">
            <a-button type="primary" @click="addResource">新增</a-button>
            <a-button type="primary" @click="modalResourceVisible = true">使用模板</a-button>
          </div>
        </div>
        <a-table
          :pagination="false"
          :rowKey="(row, key) => key"
          :columns="[
            {
              title: '资源标识',
              dataIndex: 'code',
              key: 'code',
              width: '120px',
              scopedSlots: { customRender: 'code' },
            },
            {
              title: '资源名称',
              dataIndex: 'name',
              key: 'name',
              scopedSlots: { customRender: 'name' },
            },
            {
              title: '请求方式',
              dataIndex: 'method',
              key: 'method',
              width: '120px',
              scopedSlots: { customRender: 'method' },
            },
            {
              title: '请求路由',
              dataIndex: 'path',
              key: 'path',
              scopedSlots: { customRender: 'path' },
            },
            {
              title: '操作',
              key: 'action',
              scopedSlots: { customRender: 'operation' },
              width: '100px',
            },
          ]"
          :dataSource="(currentRecord && currentRecord.resources) || []"
          class="global-ant-table dynamic-form-table"
        >
          <template slot="code" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="主键" style="display: none;">
              <a-input
                v-decorator="[
                  `resources_id[${key}]`,
                  {
                    initialValue: record.id || null,
                  },
                ]"
                type="text"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="资源标识">
              <a-input
                v-decorator="[
                  `resources_code[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '资源标识不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </template>

          <template slot="name" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="资源名称">
              <a-input
                v-decorator="[
                  `resources_name[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '资源名称不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </template>

          <template slot="method" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="请求方式">
              <a-select
                v-decorator="[
                  `resources_method[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '请求方式不能为空' }],
                  },
                ]"
                type="text"
                style="width: 100%"
              >
                <a-select-option
                  v-for="v in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
                  :key="v"
                  :value="v"
                >
                  {{ v }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </template>

          <template slot="path" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="请求路径">
              <a-input
                v-decorator="[
                  `resources_path[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '请求路径不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </template>
          <template slot="operation" slot-scope="text, record, key">
            <a href="javascript:;" @click="delResourceFormItem(key)">
              <a-icon type="delete" /> 删除
            </a>
          </template>
        </a-table>
        <div class="divider-wrapper" style="margin-top: 10px;">
          <a-divider orientation="left">操作管理</a-divider>
          <div class="buttons">
            <a-button type="primary" @click="addAction">新增</a-button>
            <a-button type="primary" @click="curdAction">使用模板</a-button>
          </div>
        </div>
        <a-table
          :pagination="false"
          :rowKey="(row, key) => key"
          :columns="[
            {
              title: '动作标识',
              dataIndex: 'code',
              key: 'code',
              scopedSlots: { customRender: 'code' },
            },
            {
              title: '动作名称',
              dataIndex: 'name',
              key: 'name',
              scopedSlots: { customRender: 'name' },
            },
            {
              title: '操作',
              key: 'action',
              scopedSlots: { customRender: 'operation' },
              width: '100px',
            },
          ]"
          :dataSource="(currentRecord && currentRecord.actions) || []"
          class="global-ant-table dynamic-form-table"
        >
          <template slot="code" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="主键" style="display: none;">
              <a-input
                v-decorator="[
                  `actions_id[${key}]`,
                  {
                    initialValue: record.id || null,
                  },
                ]"
                type="text"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" label="动作标识">
              <a-input
                v-decorator="[
                  `actions_code[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '动作标识不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </template>
          <template slot="name" slot-scope="text, record, key">
            <a-form-item v-bind="formItemLayout" label="动作名称">
              <a-input
                v-decorator="[
                  `actions_name[${key}]`,
                  {
                    initialValue: text ? text : null,
                    rules: [{ required: true, message: '动作名称不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-form-item>
          </template>
          <template slot="operation" slot-scope="text, record, key">
            <a href="javascript:;" @click="delActionFormItem(key)">
              <a-icon type="delete" /> 删除
            </a>
          </template>
        </a-table>
      </a-form>
    </a-modal>
    <a-modal
      title="菜单资源模板"
      width="440px"
      :visible="modalResourceVisible"
      @ok="curdResource"
      @cancel="modalResourceVisible = false"
    >
      <a-form :form="resourceForm" layout="horizontal">
        <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="资源名称">
          <a-row type="flex" :gutter="16">
            <a-col :span="19">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: '资源名称不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-col>
            <a-col :span="4">
              <a-tooltip title="例：用户管理">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="资源路由">
          <a-row type="flex" :gutter="16">
            <a-col :span="19">
              <a-input
                v-decorator="[
                  'path',
                  {
                    rules: [{ required: true, message: '资源路由不能为空' }],
                  },
                ]"
                type="text"
              />
            </a-col>
            <a-col :span="4">
              <a-tooltip title="例：/api/v1/users">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.dynamic-form-table {
  /deep/ .ant-form-item {
    margin: 0;
    height: auto !important;
    .ant-form-item-control-wrapper {
      width: 100%;
    }
    .ant-form-explain {
      display: none;
    }
    .ant-form-item-label {
      display: none;
    }
    .ant-form-item-control {
      line-height: initial;
    }
  }
}
.divider-wrapper {
  position: relative;
  height: 54px;
  margin-bottom: 5px;
  overflow: hidden;
  .buttons {
    position: absolute;
    top: 10px;
    right: 35px;
    padding: 0 10px;
    background: #fff;
    .ant-btn {
      margin: 0 5px;
    }
  }
}
</style>

<script>
import request from '@/utils/request';
const tableColumns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '访问路由',
    dataIndex: 'router',
    key: 'router',
    width: '180px',
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    key: 'icon',
    scopedSlots: { customRender: 'icon' },
    width: '160px',
  },
  {
    title: '排序',
    dataIndex: 'sequence',
    key: 'sequence',
    width: '120px',
  },
  {
    title: '是否显示',
    dataIndex: 'hidden',
    key: 'hidden',
    scopedSlots: { customRender: 'hidden' },
    width: '120px',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '200px',
  },
];
export default {
  data() {
    return {
      loading: false,
      expandedRowKeys: [],
      tableColumns,
      dataSource: [],
      cloneDataSource: [],
      treeDataSource: [],
      formHasError: false,
      search: {
        name: null,
      },
      currentRecord: null,
      modalIsCreate: true,
      modalVisible: false,
      modalResourceVisible: false,
      modalConfirmLoading: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
      tailFormItemLayout: {
        wrapperCol: { span: 18, offset: 6 },
      },
    };
  },
  mounted() {
    this.getDataSource();
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'menu' });
    this.resourceForm = this.$form.createForm(this, { name: 'resource' });
  },
  methods: {
    getDataSource() {
      this.loading = true;
      request({
        url: `/api/v1/menus-tree`,
        method: 'GET',
      })
        .then(resp => {
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
              item.title = item.name;
              item.value = item.id;
              if (!item.parent_id) {
                item.key = item.id;
              } else {
                item.key = `${item.parent_path}/${item.id}`;
              }
            }
          };
          fn1(resp);
          this.treeDataSource = resp;
          this.dataSource = JSON.parse(JSON.stringify(resp));
          this.cloneDataSource = JSON.parse(JSON.stringify(resp));
          this.expandedRowKeys = resp.map(t => t.id);
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    onSearch() {
      if (this.search.name) {
        let list = JSON.parse(JSON.stringify(this.cloneDataSource));
        const fn1 = list => {
          let hit = false;
          for (const key in list) {
            const item = list[key];
            hit = false;
            if (item.children && item.children.length) {
              hit = fn1(item.children);
            }
            if (item.name.indexOf(this.search.name) === -1) {
              item.deleted = !hit;
            } else {
              item.deleted = false;
              hit = true;
            }
          }
          return hit;
        };

        const fn2 = item => {
          if (item.children && item.children.length) {
            item.children = item.children.filter(fn2);
          }
          return !item.deleted;
        };

        fn1(list);
        this.dataSource = list.filter(fn2);
      } else {
        this.getDataSource();
      }
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
        url: '/api/v1/menus/' + id,
        method: 'DELETE',
      })
        .then(resp => {
          this.$message.success('删除成功');
          this.getDataSource();
        })
        .catch(err => {});
    },
    /**
     * 打开Modal
     */
    showModal(record) {
      this.modalIsCreate = !record;
      if (record) {
        this.currentRecord = JSON.parse(JSON.stringify(record));
      } else {
        this.currentRecord = { sequence: 10000, hidden: 0, resources: [], actions: [] };
      }
      this.modalVisible = true;
    },
    /**
     * 提交Modal
     */
    handleOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {
            name,
            parent_id,
            icon,
            router,
            sequence,
            hidden,
            resources_id,
            resources_code,
            resources_name,
            resources_method,
            resources_path,
            actions_id,
            actions_code,
            actions_name,
          } = values;
          const resources = [];
          const actions = [];
          this.modalConfirmLoading = true;
          this.formHasError = false;
          for (let i = 0; i < this.currentRecord.resources.length; i++) {
            const id = resources_id[i];
            const code = resources_code[i];
            const name = resources_name[i];
            const method = resources_method[i];
            const path = resources_path[i];
            resources.push({ id, code, name, method, path });
          }
          for (let i = 0; i < this.currentRecord.actions.length; i++) {
            const id = actions_id[i];
            const code = actions_code[i];
            const name = actions_name[i];
            actions.push({ id, code, name });
          }
          const data = {
            name,
            parent_id,
            icon,
            router,
            sequence,
            hidden,
            resources,
            actions,
          };
          request({
            url: this.modalIsCreate ? '/api/v1/menus' : '/api/v1/menus/' + this.currentRecord.id,
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
        } else {
          this.formHasError = true;
        }
      });
    },
    addResource() {
      this.currentRecord.resources.push({ id: null, code: '', name: '', method: 'GET', path: '' });
    },
    curdResource() {
      this.resourceForm.validateFields((err, values) => {
        if (!err) {
          const { name, path } = this.resourceForm.getFieldsValue();
          this.currentRecord.resources.push({
            id: null,
            code: 'query',
            name: `查询${name}`,
            method: 'GET',
            path: path,
          });
          this.currentRecord.resources.push({
            id: null,
            code: 'get',
            name: `精确查询${name}`,
            method: 'GET',
            path: `${path}/:id`,
          });
          this.currentRecord.resources.push({
            id: null,
            code: 'create',
            name: `创建${name}`,
            method: 'POST',
            path: path,
          });
          this.currentRecord.resources.push({
            id: null,
            code: 'update',
            name: `更新${name}`,
            method: 'PUT',
            path: `${path}/:id`,
          });
          this.currentRecord.resources.push({
            id: null,
            code: 'delete',
            name: `删除${name}`,
            method: 'DELETE',
            path: `${path}/:id`,
          });
          this.modalResourceVisible = false;
          this.resourceForm.resetFields();
        }
      });
    },
    addAction() {
      this.currentRecord.actions.push({ id: null, code: '', name: '' });
    },
    curdAction() {
      this.currentRecord.actions.push({
        id: null,
        code: 'query',
        name: '查询',
      });
      this.currentRecord.actions.push({
        id: null,
        code: 'create',
        name: '新增',
      });
      this.currentRecord.actions.push({
        id: null,
        code: 'edit',
        name: '编辑',
      });
      this.currentRecord.actions.push({
        id: null,
        code: 'delete',
        name: '删除',
      });
    },
    delResourceFormItem(key) {
      const {
        resources_id,
        resources_code,
        resources_name,
        resources_method,
        resources_path,
      } = this.form.getFieldsValue();
      this.currentRecord.resources.splice(key, 1);
      resources_id.splice(key, 1);
      resources_code.splice(key, 1);
      resources_name.splice(key, 1);
      resources_method.splice(key, 1);
      resources_path.splice(key, 1);
      this.form.setFieldsValue({
        resources_id,
        resources_code,
        resources_name,
        resources_method,
        resources_path,
      });
    },
    delActionFormItem(key) {
      const { actions_id, actions_code, actions_name } = this.form.getFieldsValue();
      this.currentRecord.actions.splice(key, 1);
      actions_id.splice(key, 1);
      actions_code.splice(key, 1);
      actions_name.splice(key, 1);
      this.form.setFieldsValue({
        actions_id,
        actions_code,
        actions_name,
      });
    },
    /**
     * 关闭Modal
     */
    handleCancel(e) {
      this.modalVisible = false;
      this.formHasError = false;
      this.currentRecord = null;
      this.form.resetFields();
    },
  },
};
</script>
