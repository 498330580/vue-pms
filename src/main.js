import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'

// 导入阿里图标库
import './assets/css/ali/iconfont.css'

// 导入请求包
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/' // 全局api地址
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
