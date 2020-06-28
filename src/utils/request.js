import axios from 'axios';
import router from '../router';
import { getCacheItem, delCacheItem, TOKEN, USER } from './localStorage';
import { notification } from 'ant-design-vue';

// axios defaults 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.url.indexOf('/auth') === -1 && getCacheItem(TOKEN)) {
      config.headers.Authorization = `Token ${getCacheItem(TOKEN)}`;
      // TODO token 刷新实现
      // if (config.url.indexOf('/auth/token') !== -1) {
      //   config.headers.Authorization = `Bearer ${store.state.refreshToken}`;
      // } else {
      //   config.headers.Authorization = `Bearer ${store.state.token}`;
      // }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // 结合服务端自己封装结果进行部分业务逻辑封装
    return response;
  },
  error => {
    if (error.response) {
      // 清除token信息并跳转到登录页面
      if (error.response.status === 401 || error.response.status === 406) {
        delCacheItem(TOKEN);
        delCacheItem(USER);
        router.replace({
          path: '/account/login',
          query: { redirect: router.currentRoute.fullPath }
        });
      }
      // 其它业务或者权限问题直接将 response 返回
      return Promise.reject(error.response);
    }
    // 返回response 为 null 的情况，底层不处理
    return Promise.resolve(error.response);
  }
);

function request(options) {
  return axios(options)
    .then(res => {
      return res.data;
    })
    .catch(error => {
      const {
        status, statusText, data
      } = error;
      notification.error({
        message: h => (
          <div>
            请求错误 <span style="color: red">{status}</span> : {options.url}
          </div>
        ),
        description: (data && data.msg) || statusText
      });
      return Promise.reject(error.data);
    });
}

export default request;
