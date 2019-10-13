import Vue from 'vue' // 导入vue
import VueRouter from 'vue-router' // 导入路由
import Login from '@/views/login' // 导入login（登录）组件
import Tabbar from '@/views/tabbar' // 导入Tabbar（标签栏）组件
import Home from '@/views/home' // 导入首页组件
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    // 登录页面路由
    {
      name: 'login',
      path: '/login', // 路径（导航）
      component: Login // 登录组件
    },
    // 底部标签栏路由（父路由）
    {
      path: '/',
      component: Tabbar,
      // 二级路由首页（子路由）
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: Home
        }
      ]

    }
  ]
})

export default router
