import Vue from 'vue'
import App from './App.vue'
import VueVirtualScroller from '../../vue-virtual-scroller/src/index'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
Vue.use(VueVirtualScroller)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// const app = createApp(App)
const app = new Vue({
  render: (h) => h(App),
}).$mount("#app");