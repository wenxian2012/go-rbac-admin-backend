<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view />
    </a-locale-provider>
  </div>
</template>

<style lang="less">
html,
body {
  height: 100%;
  font-family: PingFang SC, PingFang-SC-Regular, Helvetica Neue, Helvetica, Arial, Microsoft Yahei,
    Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.65);
}

input,
select,
option,
button,
textarea {
  outline: none;
}

ol,
ul,
dl {
  list-style: none;
  padding: 0;
  margin: 0;
}

a:focus,
a:hover {
  text-decoration: none;
}

.h100 {
  height: 100% !important;
}

.w100 {
  width: 100% !important;
}

.ml10 {
  margin-left: 10px;
}

.mr10 {
  margin-right: 10px;
}

.container {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

#app {
  height: 100%;
}

.ui-small-form {
  &.ant-form.ant-form-horizontal {
    /deep/ .ant-form-item {
      margin-bottom: 4px;
    }
  }
  &.ant-form.ant-of-inline,
  &.ant-form.ant-form-inline {
    /deep/ .ant-form-item {
      margin-bottom: 4px;
    }
    /deep/ .ant-form-explain {
      display: none;
    }
    &.ant-form-has-error .ant-form-item {
      height: 56px;
      .ant-form-explain {
        display: block;
      }
    }
  }
}

.search-form {
  margin-bottom: 12px;
  .col-input {
    width: 240px;
    margin-right: 8px;
  }
  .col-select {
    width: 120px;
    margin-right: 8px;
  }
  .col-button {
    .ant-btn {
      margin-right: 8px;
    }
  }
  .flex-r {
    flex: 1;
    text-align: right;
  }
}

.global-ant-table {
  /deep/ .ant-table {
    color: rgba(0, 0, 0, 0.85);
    .action {
      a {
        color: rgba(0, 0, 0, 0.85);
      }
      .anticon {
        margin: 0 4px;
      }
    }
  }
  /deep/ .ant-table-body {
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    .ant-table-thead > tr > th {
      border-bottom: 2px solid #d1d1d1;
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 11px 16px;
      font-size: 12px;
    }
  }
}

.ant-menu-submenu-popup {
  background: initial;
  .ant-menu-vertical {
    box-shadow: none;
    border: 1px solid #e0e0e0;
    .ant-menu-item {
      height: 35px;
      line-height: 36px;
      margin: 0;
      font-size: 13px;
      border-bottom: 1px solid rgba(213, 213, 213, 0.5);
      overflow: hidden;
      &:last-child {
        border-bottom: 0;
      }
      &.ant-menu-item-selected,
      &.ant-menu-item-active {
        background-color: initial;
        font-weight: 400;
      }
    }
  }
}
</style>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from 'ant-design-vue/lib/locale-provider/en_US';
import moment from 'moment';
import request from '@/utils/request';
import 'moment/locale/zh-cn';
import { getCacheItem, USER, TOKEN, MENUS } from '@/utils/localStorage';
export default {
  data() {
    return {
      locale: zhCN,
    };
  },
  created() {
    const user = getCacheItem(USER);
    if (!user) {
      this.$router.replace({
        path: '/account/login',
      });
    } else {
      request({
        url: '/api/v1/account/token',
        method: 'get',
      })
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    }
  },
};
</script>
