<template>
  <a-layout style="min-height: 100vh">
    <a-layout-header class="app-header-wrapper">
      <Header />
    </a-layout-header>
    <a-layout class="app-breadcrumb-wrapper">
      <Breadcrumb />
    </a-layout>
    <a-layout>
      <a-layout-sider
        :trigger="null"
        collapsible
        v-model="collapsed"
        width="200px"
        collapsedWidth="64px"
        class="app-sider-wrapper"
      >
        <SiderMenu :collapsed="collapsed" />
      </a-layout-sider>
      <a-layout-content>
        <div class="view-wrapper">
          <router-view></router-view>
        </div>
        <a-layout-footer>
          <Footer />
        </a-layout-footer>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
.app-header-wrapper {
  position: relative;
  height: 64px;
  line-height: normal;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 99;
}
.app-breadcrumb-wrapper {
  position: relative;
  height: 45px;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  padding: 12px 0;
  flex: 0 0 auto;
  z-index: 99;
}
.app-sider-wrapper {
  position: relative;
  background-color: #fff;
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #e0e0e0;
  }
}
.view-wrapper {
  height: calc(~"100% - 45px");
}
/deep/ .ant-layout-content {
  display: flex;
  flex-direction: column;
  margin: 16px 16px 0;
}
/deep/ .ant-layout-footer {
  padding: 12px 0;
  height: 45px;
  text-align: center;
}
</style>

<script>
import Header from "./Header";
import Footer from "./Footer";
import SiderMenu from "./SiderMenu";
import Breadcrumb from "./Breadcrumb";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapState("global", {
      collapsed: state => state.siderCollapsed
    })
  },
  components: {
    Header,
    Footer,
    SiderMenu,
    Breadcrumb
  }
};
</script>


