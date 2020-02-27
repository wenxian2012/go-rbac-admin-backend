<template>
  <div class="wrapper">
    <div class="app-aside" :class="{collapsed}"><a-icon @click="toggleCollapse" class="toggle-btn" type="menu-fold" /></div>
    <div class="app-breadcrumb">
      <div class="meta-title">{{menus[menus.length-1].meta.title}}</div>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="item in menus" :key="item.path"><router-link :to="item.path">{{item.meta.title}}</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  .app-aside {
    width: 200px;
    height: 20px;
    line-height: 22px;
    text-align: right;
    border-right: 1px solid #e0e0e0;
    transition: width 0.2s cubic-bezier(0.25, 0, 0.15, 1),
      translate 0.2s cubic-bezier(0.25, 0, 0.15, 1);
    overflow: hidden;
    &.collapsed {
      width: 64px;
    }
    .toggle-btn {
      font-size: 15px;
      margin-right: 15px;
      color: rgba(0,0,0,.65);
      font-weight: 700;
      cursor: pointer;
    }
  }
  .app-breadcrumb {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    padding-left: 16px;
    .meta-title {
      margin-right: 14px;
      font-weight: 700;
      font-size: 14px;
    }
    /deep/ .ant-breadcrumb {
      font-size: 12px;
      span,
      a {
        color: rgba(0,0,0,.45);
        transition: color .3s;
      }
    }
  }
}
</style>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      menus: this.$route.matched.filter(t => !!t.path)
    }
  },
  watch: {
    "$route.path": function(val) {
      this.menus = this.$route.matched.filter(t => !!t.path);
    },
  },
  computed: {
    ...mapState('global', {
      collapsed: state => state.siderCollapsed,
    }),
  },
  created() {
  },
  methods: {
    ...mapMutations('global', [
      'toggleCollapse'
    ])
  }
};
</script>
