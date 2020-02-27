<template>
  <div style="width: 200px">
    <a-menu
      :selectedKeys="selectedKeys"
      :openKeys.sync="openKeys"
      :inlineIndent="16"
      mode="inline"
      class="app-sider-menu"
    >
      <template v-for="item in menuData">
        <a-menu-item
          v-if="!item.children"
          :key="item.path"
          @click="() => $router.push({ path: item.path, query: $route.query }).catch(err=>{})"
        >
          <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
        <sub-menu v-else :menu-info="item" :key="item.path" />
      </template>
    </a-menu>
  </div>
</template>

<style lang="less" scoped>
.app-sider-menu {
  &.ant-menu-inline-collapsed {
    width: 64px;
    .ant-menu-submenu {
      /deep/ .ant-menu-submenu-title {
        padding: 24px 0 !important;
        text-align: center;
        .anticon {
          font-size: 24px;
        }
        .anticon + span {
          display: none;
        }
        .ant-menu-submenu-arrow {
          display: none;
        }
      }
    }
  }
  > .ant-menu-item {
    font-size: 13px;
    position: relative;
    height: 35px;
    line-height: 36px;
    margin: 0;
    font-size: 13px;
    border-left: 3px solid transparent;
    width: auto;
    box-sizing: content-box;
    overflow: hidden;
    &::after {
      display: none;
    }
    &.ant-menu-submenu-active {
      background-color: #f0f0f0;
    }
    &.ant-menu-item-selected {
      background-color: #f0f0f0;
      border-color: #1890ff;
      font-weight: 400;
    }
  }
  .ant-menu-submenu {
    font-size: 13px;
    /deep/ .ant-menu-submenu-title {
      position: relative;
      height: 35px;
      line-height: 36px;
      margin: 0;
      font-size: 13px;
      border-left: 3px solid transparent;
      width: auto;
      box-sizing: content-box;
      overflow: hidden;
    }
    &.ant-menu-submenu-active /deep/ .ant-menu-submenu-title {
      background-color: #f0f0f0;
    }
    &.ant-menu-submenu-selected /deep/ .ant-menu-submenu-title {
      background-color: #f0f0f0;
      border-color: #1890ff;
      font-weight: 400;
    }
    /deep/ .ant-menu-sub .ant-menu-item{
      height: 35px;
      line-height: 36px;
      margin: 0;
      padding-right: 0;
      font-size: 12px;
      overflow: hidden;
      > span {
        display: block;
        height: 35px;
        margin-left: 8px;
        padding-left: 2px;
        border-bottom: 1px solid rgba(213,213,213,.5);
      }
      &.ant-menu-item-selected {
        background-color: initial;
        > span {
          font-weight: 400;
        }
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>

<script>
import SubMenu from "./SubMenu";
import { check } from "@/utils/auth";
import { getCacheItem, FLAT_MENUS} from "@/utils/localStorage";
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    "sub-menu": SubMenu
  },
  watch: {
    "$route.path": function(val) {
      this.selectedKeys = this.selectedKeysMap[val];
      this.openKeys = this.collapsed ? [] : this.openKeysMap[val];
      this.getRouteMenu();
    },
    collapsed(val) {
      if (val) {
        this.cacheOpenKeys = this.openKeys;
        this.openKeys = [];
      } else {
        this.openKeys = this.cacheOpenKeys;
      }
    }
  },
  data() {
    this.selectedKeysMap = {};
    this.openKeysMap = {};
    return {
      menuData: [],
      selectedKeys: this.selectedKeysMap[this.$route.path],
      openKeys: this.collapsed ? [] : this.openKeysMap[this.$route.path]
    };
  },
  created() {
    this.getRouteMenu();
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    getRouteMenu() {
      const router = this.$router.options.routes
        .find(t => t.path === "/")
        .children;
      const route = this.$route.matched.filter(t => !!t.path);
      if (route.length) {
        const top = route[0];
        const find = router.find(t=>t.path === top.path);
        const flatMenus = getCacheItem(FLAT_MENUS);
        const flatMenuKeys = flatMenus.map(t=>t.router);
        const children = find.children.filter(t => flatMenuKeys.includes(t.path)).map(t => {
          const tt = flatMenus.find(k => t.path === k.router);
          return Object.assign({}, t, {meta: {icon: tt.icon, title: tt.name}})
        });
        this.menuData = this.getMenuData(children);
      }
    },
    getMenuData(routes = [], parentKeys = [], selectedKey) {
      const menuData = [];
      for (let item of routes) {
        if (item.meta && item.meta.authority && !check(item.meta.authority)) {
          continue;
        }
        if (item.name && !item.hideInMenu) {
          this.openKeysMap[item.path] = parentKeys;
          this.selectedKeysMap[item.path] = [selectedKey || item.path];
          const newItem = { ...item };
          delete newItem.children;
          if (item.children && !item.hideChildrenInMenu) {
            newItem.children = this.getMenuData(item.children, [
              ...parentKeys,
              item.path
            ]);
          } else {
            this.getMenuData(
              item.children,
              selectedKey ? parentKeys : [...parentKeys, item.path],
              selectedKey || item.path
            );
          }
          menuData.push(newItem);
        } else if (
          !item.hideInMenu &&
          !item.hideChildrenInMenu &&
          item.children
        ) {
          menuData.push(
            ...this.getMenuData(item.children, [...parentKeys, item.path])
          );
        }
      }

      return menuData;
    }
  }
};
</script>
