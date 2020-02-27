<template>
  <div class="login-page">
    <section class="h100">
      <div class="header">
        <div class="header-wrapper">
          <h1 class="logo">
            <a href="">使用涂鸦账号登录</a>
          </h1>
        </div>
      </div>
      <div class="container h100">
        <div class="login-form">
          <div class="brand"></div>
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">使用账号密码登录</h4>
              <a-form :form="form">
                <a-form-item :wrapper-col="{span: 24}">
                  <a-input
                    size="large"
                    v-decorator="[
                      'username',
                      { rules: [{ required: true, message: '用户名不能为空' }] },
                    ]"
                    placeholder="请输入用户名"
                  />
                </a-form-item>
                <a-form-item :wrapper-col="{span: 24}">
                  <a-input
                    size="large"
                    type="password"
                    v-decorator="[
                      'password',
                      { rules: [{ required: true, message: '密码不能为空' }] },
                    ]"
                    placeholder="密码"
                  />
                </a-form-item>
                <a-form-item :wrapper-col="{span: 24}" style="margin-bottom: 6px">
                  <a-button
                    class="btn-ok"
                    size="large"
                    :loading="loading"
                    type="primary"
                    @click="check"
                  >登录</a-button>
                </a-form-item>
                <a-form-item :wrapper-col="{span: 24}"></a-form-item>
              </a-form>
            </div>
          </div>
        </div>
        <div class="footer">Copyright &copy; 2015-2019 &mdash; 涂鸦智能</div>
      </div>
    </section>
  </div>
</template>

<style lang="less" scoped>
.login-page {
  height: 100%;
  background: #f8f8f8;
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .header {
    position: absolute;
    width: 100%;
    height: 44px;
    top: 0;
    left: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }
  .header .header-wrapper {
    height: 44px;
    margin: 0 auto;
  }

  .header .header-wrapper .logo {
    float: left;
    margin: 6px 0 6px 25px;
    overflow: hidden;
  }

  .header .header-wrapper .logo a {
    float: left;
    height: 0;
    width: 100px;
    padding-top: 30px;
    background: url("../../assets/images/logo.png") no-repeat 0 center;
    background-size: contain;
    overflow: hidden;
  }

  .brand {
    float: left;
    width: 540px;
    height: 400px;
    background: url("../../assets/images/banner.png") no-repeat 0 0;
    background-size: cover;
  }

  .login-form {
    width: 962px;
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    margin-top: -60px;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    .card {
      float: left;
      width: 420px;
      height: 400px;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      border-left-width: 0;
    }

    .card-body {
      padding: 2em 3em;
    }

    .card-title {
      padding-top: 30px;
      margin-bottom: 40px;
      text-align: center;
      font-weight: normal;
      font-size: 1.65rem;
    }

    .btn-ok {
      width: 100%;
    }
  }
}

.login-page .footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 18px;
  padding: 10px 0 25px 0;
  text-align: center;
}
</style>

<script>
import request from "@/utils/request";
import { setCacheItem, TOKEN, USER, MENUS, FLAT_MENUS} from "@/utils/localStorage";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "login_form" }),
      loading: false
    };
  },
  methods: {
    check() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          request({
            url: "/api/account/login",
            method: "POST",
            data: values
          })
            .then(resp => {
              this.loading = false;
              const { menus, token, user } = resp;
              const flatMenus = [];
              const fn1 = (list) => {
                  for (const item of list) {
                      if (item.router) {
                          flatMenus.push(item);
                      }
                      if (item.children) {
                          fn1(item.children);
                      }
                  }
              };
              fn1(menus);
              setCacheItem(TOKEN, token);
              setCacheItem(USER, user);
              setCacheItem(MENUS, menus);
              setCacheItem(FLAT_MENUS, flatMenus);
              const redirect = this.$route.query.redirect || "/dashboard";
              this.$router.replace({ path: redirect });
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
