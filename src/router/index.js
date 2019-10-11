import Vue from 'vue' // 导入vue
import VueRouter from 'vue-router' // 导入路由
import Login from '@/views/login' // 导入login（登录）组件

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    // 登录页面路由
    {
      name: 'login',
      path: '/login', // 路径（导航）
      component: Login // 登录组件
    }
  ]
})

export default router
