import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { NavBar, Field, Button, Cell, CellGroup, Toast } from 'vant' // 导入导航组件、输入框组件、按钮组件
import './styles/index.less'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate' // 核心组件
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules' // 验证规则
Vue.config.productionTip = false

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 扩展自定义校验规则
// extend('规则名称', 配置对象)
extend('phone', {
  // 验证方法，value 是需要校验的数据，返回一个布尔值，表示验证成功与否
  validate: function (value) {
    return /^1\d{10}$/.test(value)
  },
  // 错误提示消息
  message: '请输入有效的手机号码'
})

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
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
