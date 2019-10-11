import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { NavBar, Field, Button, Cell, CellGroup, Toast } from 'vant' // 导入导航组件、输入框组件、按钮组件
import './styles/index.less'
Vue.config.productionTip = false
Vue
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
