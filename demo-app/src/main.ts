import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAlignLeft,
  faCaretDown,
  faCaretRight,
  faFileMedical,
  faFolderPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

library.add(
  faCaretDown,
  faCaretRight,
  faAlignLeft,
  faTrash,
  faFolderPlus,
  faFileMedical,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
