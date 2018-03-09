/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import Vuex from 'vuex';
import store from './store'
import Code from "./common/code"
import { sync } from 'vuex-router-sync'


Vue.config.productionTip = false
Vue.config.devtools = true

const unsync = sync(store, router)

Vue.use(iView);
Vue.use(Vuex);

Vue.prototype.$code = Code.CodeInit();
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
})
