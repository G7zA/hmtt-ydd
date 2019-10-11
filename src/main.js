import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { NavBar, Field, Button } from 'vant' // 导入导航组件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  NavBar,
  Field,
  Button,
  render: h => h(App)
}).$mount('#app')
