import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import {
  Button,
  Layout,
  Icon,
  Drawer,
  Radio,
  Menu,
  Form,
  Input,
  Select,
  LocaleProvider,
  Dropdown,
  DatePicker,
  Badge,
  Tabs,
  Spin,
  List,
  Avatar,
  Tooltip,
  Tag,
  Checkbox,
  Col,
  Row,
  Popover,
  Progress,
  Alert,
  Breadcrumb,
  Table,
  Divider,
  Modal,
  Popconfirm,
  InputNumber,
  TreeSelect,
  message,
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(LocaleProvider);
Vue.use(Dropdown);
Vue.use(DatePicker);
Vue.use(Avatar);
Vue.use(Tooltip);
Vue.use(Badge);
Vue.use(Tabs);
Vue.use(Spin);
Vue.use(List);
Vue.use(Tag);
Vue.use(Checkbox);
Vue.use(Col);
Vue.use(Row);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Alert);
Vue.use(Breadcrumb);
Vue.use(Table);
Vue.use(Divider);
Vue.use(Modal);
Vue.use(InputNumber);
Vue.use(Popconfirm);
Vue.use(TreeSelect);
Vue.prototype.$message = message;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
