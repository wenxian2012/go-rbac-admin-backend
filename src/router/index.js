import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
// import findLast from 'lodash/findLast';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

const routes = [
  {
    path: '/account/login',
    hideInMenu: true,
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Account/Login')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "layout" */ '../components/Layout/BasicLayout'),
    children: [
      {
        path: '/',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        redirect: '/dashboard/home',
        name: 'dashboard',
        meta: { icon: 'dashboard', title: '数据分析' },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/dashboard/home',
            name: 'home',
            meta: { icon: 'dashboard', title: '数据概况' },
            component: () =>
              import(/* webpackChunkName: "dashboard" */ '../views/Dashboard/Home')
          }
        ]
      },
      {
        path: '/system',
        redirect: '/system/users',
        name: 'system',
        meta: { icon: 'setting', title: '系统设置' },
        component: { render: h => h('router-view') },
        children: [
          {
            path: '/system/users',
            name: 'users',
            meta: { icon: 'user', title: '用户管理' },
            component: () =>
              import(/* webpackChunkName: "system" */ '../views/System/Users/Home')
          },
          {
            path: '/system/roles',
            name: 'roles',
            meta: { icon: 'usergroup-add', title: '角色管理' },
            component: () =>
              import(/* webpackChunkName: "system" */ '../views/System/Roles/Home')
          },
          {
            path: '/system/menus',
            name: 'menus',
            meta: { icon: 'unlock', title: '权限管理' },
            component: () =>
              import(/* webpackChunkName: "system" */ '../views/System/Menus/Home')
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  // const record = findLast(to.matched, record => record.meta.authority);
  // if (record && !check(record.meta.authority)) {
  //   if (!isLogin() && to.path !== "/user/login") {
  //     next({
  //       path: "/user/login"
  //     });
  //   } else if (to.path !== "/403") {
  //     notification.error({
  //       message: "403",
  //       description: "你没有权限访问，请联系管理员咨询。"
  //     });
  //     next({
  //       path: "/403"
  //     });
  //   }
  //   NProgress.done();
  // }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
