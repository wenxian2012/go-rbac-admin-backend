<template>
  <div class="wrapper">
    <div class="logo">
      <img alt="" v-if="collapsed" :src="logoSmall">
      <img alt="" v-else :src="logoLarge">
    </div>
    <ul class="nav">
      <li v-for="item in nav" :key="item.path">
        <router-link active-class="cur" :to="item.router">{{item.name}}</router-link>
      </li>
    </ul>
    <div class="user-menu">
      <a-dropdown>
        <div class="user-info">
          <span class="avatar">
            <img :src="avatar" alt="">
          </span>
          <span class="username">{{user.username}}</span>
        </div>
        <a-menu slot="overlay">
          <a-menu-item @click="logout">
            <a-icon type="logout"/>退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .logo img {
    max-height: 34px;
  }
  .nav {
    flex: 1;
    text-align: center;
    list-style: none;
    li {
      display: inline-block;
      padding: 0 24px;
      a {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        font-weight: 700;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        text-decoration: none;
        &.cur::after {
          display: block;
          position: relative;
          height: 0;
          width: 100%;
          margin-top: -3px;
          border-bottom: 3px solid #1890ff;
          bottom: 0;
          content: "";
        }
      }
    }
  }
  .user-menu {
    .user-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px;
      margin-right: 12px;
      .avatar {
        height: 24px;
        margin-right: 8px;
        img {
          max-height: 100%;
          vertical-align: top;
        }
      }
    }
  }
}
</style>

<script>
import logoLarge from "@/assets/images/logo-large.png";
import logoSmall from "@/assets/images/logo-small.png";
import avatar from "@/assets/images/avatar.png";
import { getCacheItem, delCacheItem, FLAT_MENUS, USER, TOKEN, MENUS } from "@/utils/localStorage";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      logoLarge,
      logoSmall,
      avatar,
      menus: getCacheItem(FLAT_MENUS),
      user: getCacheItem(USER),
      nav: []
    };
  },
  mounted() {
    const router = this.menus.map(t => t.router);
    this.nav = this.$router.options.routes
      .find(t => t.path === "/")
      .children.filter(t => router.includes(t.path))
      .map(t => {
        return this.menus.find(tt => tt.router === t.path);
      }).sort((a, b) => {
        return b.sequence - a.sequence;
      });
  },
  methods: {
    logout() {
      delCacheItem(FLAT_MENUS);
      delCacheItem(MENUS);
      delCacheItem(TOKEN);
      delCacheItem(USER);
      this.$router.replace({
        path: '/account/login',
      });
    }
  },
  computed: {
    ...mapState("global", {
      collapsed: state => state.siderCollapsed
    })
  }
};
</script>


