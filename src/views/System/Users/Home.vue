<template>
  <div class="wrapper">
    <div class="search-form">
      <a-row type="flex" align="middle">
        <a-col class="col-input">
          <a-input
            v-model="search.username"
            placeholder="请输入: 用户名"
            @keyup.enter="getDataSource"
          />
        </a-col>
        <a-col class="col-input">
          <a-input
            v-model="search.nickname"
            placeholder="请输入: 姓名"
            @keyup.enter="getDataSource"
          />
        </a-col>
        <a-col class="col-select">
          <a-select v-model="search.roleId" allowClear placeholder="所属角色" style="width: 100%">
            <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
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
      <template slot="roles" slot-scope="_roles">
        <template v-if="_roles.length">
          <a-tag v-for="item in _roles" :key="item.id" color="blue">{{ item.name }}</a-tag>
        </template>
        <template v-else>--</template>
      </template>
      <template slot="disabled" slot-scope="disabled">
        <a-tag :color="disabled === 1 ? 'pink' : 'green'">
          {{ disabled === 1 ? '关闭' : '开启' }}
        </a-tag>
      </template>
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
      :title="modalIsCreate ? '新增管理员' : '编辑管理员'"
      :visible="modalVisible"
      :confirmLoading="modalConfirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" class="ui-small-form">
        <a-form-item v-bind="formItemLayout" label="用户名">
          <a-input
            v-decorator="[
              'username',
              {
                initialValue: currentRecord ? currentRecord.username : null,
                rules: [
                  { required: true, message: '用户名不能为空' },
                  {
                    pattern: /^[a-zA-Z0-9_-]{4,30}$/,
                    message: '用户名由4到30位（字母，数字，下划线，减号）字符组成',
                  },
                ],
              },
            ]"
            type="text"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="姓名">
          <a-input
            v-decorator="[
              'nickname',
              {
                initialValue: currentRecord ? currentRecord.nickname : null,
                rules: [{ required: true, message: '姓名不能为空' }],
              },
            ]"
            type="text"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="手机号">
          <a-input
            v-decorator="[
              'phone',
              {
                initialValue: currentRecord ? currentRecord.phone : null,
                rules: [{ pattern: /^1\d{10}$/, message: '手机号码格式不正确' }],
              },
            ]"
            type="text"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="邮箱">
          <a-input
            v-decorator="[
              'email',
              {
                initialValue: currentRecord ? currentRecord.email : null,
                rules: [
                  {
                    pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                    message: '电子邮箱格式不正确',
                  },
                ],
              },
            ]"
            type="text"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="角色">
          <a-select
            v-decorator="[
              'roles',
              {
                initialValue:
                  currentRecord && currentRecord.roles.length
                    ? currentRecord.roles.map(t => t.id)
                    : undefined,
                rules: [{ required: true, message: '角色不能为空' }],
              },
            ]"
            mode="multiple"
          >
            <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="密码">
          <a-input
            v-decorator="[
              'password',
              {
                rules: [
                  { required: modalIsCreate, message: '密码不能为空' },
                  { min: 6, message: '密码不能少于6个字符' },
                  { validator: validateToNextPassword },
                ],
              },
            ]"
            type="password"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="确认密码">
          <a-input
            v-decorator="[
              'confirm',
              {
                rules: [
                  { required: modalIsCreate, message: '密码不能为空' },
                  { min: 6, message: '密码不能少于6个字符' },
                  { validator: compareToFirstPassword },
                ],
              },
            ]"
            type="password"
            @blur="handlePasswordConfirmBlur"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped></style>

<script>
import request from '@/utils/request';
import { getCacheItem, USER } from '@/utils/localStorage';
import queryString from 'query-string';
const tableColumns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    customRender: text => {
      return text || '--';
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    customRender: text => {
      return text || '--';
    },
  },
  {
    title: '角色',
    key: 'roles',
    dataIndex: 'roles',
    scopedSlots: { customRender: 'roles' },
  },
  {
    title: '状态',
    key: 'disabled',
    dataIndex: 'disabled',
    scopedSlots: { customRender: 'disabled' },
  },
  {
    title: '最后更新',
    key: 'updated_at',
    dataIndex: 'updated_at',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
export default {
  data() {
    return {
      roles: [],
      loading: false,
      dataSource: [],
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
        username: null,
        nickname: null,
        roleId: undefined,
      },
      currentRecord: null,
      modalIsCreate: true,
      modalVisible: false,
      modalConfirmLoading: false,
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
      },
      tailFormItemLayout: {
        wrapperCol: { span: 16, offset: 8 },
      },
    };
  },
  mounted() {
    this.getDataSource();
    request({
      url: '/api/v1/roles',
      method: 'GET',
      params: { pageSize: -1 },
    })
      .then(resp => {
        this.roles = resp.list;
      })
      .catch(err => {});
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'user' });
  },
  methods: {
    getDataSource() {
      const { pageIndex, pageSize } = this.pagination;
      const searchParams = queryString.stringify(this.search, {
        skipNull: true,
      });
      this.loading = true;
      request({
        url: `/api/v1/users${searchParams ? '?' + searchParams : ''}`,
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
        username: null,
        nickname: null,
        roleId: undefined,
      };
      this.getDataSource();
    },
    /**
     * 删除记录
     */
    onDelete(e) {
      const id = e.id;
      request({
        url: '/api/v1/users/' + id,
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
      this.modalIsCreate = !record;
      if (record) {
        this.currentRecord = record;
      }
      this.modalVisible = true;
    },
    /**
     * 密码效验
     */
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('您输入的两个密码不一致!');
      } else {
        callback();
      }
    },
    /**
     * 密码效验
     */
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
    /**
     * 密码失焦
     */
    handlePasswordConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    /**
     * 提交Modal
     */
    handleOk(e) {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const { email, password, nickname, username, phone, roles } = values;
          this.modalConfirmLoading = true;
          const data = {
            username,
            nickname,
            email,
            phone,
            roles,
          };
          if (this.modalIsCreate) {
            data.password = password;
          }
          request({
            url: this.modalIsCreate ? '/api/v1/users' : '/api/v1/users/' + this.currentRecord.id,
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
