import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage' // 引入获取token的方法模块
// vuex容器
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 使用 Vuex 容器存储 token 分为5步
    // user: null 第一步
    // 第六步 初始化的时候从本地存储获取数据，没有就是 null
    user: getItem('user')
  },
  mutations: {
    // 第二步 使用vue容器储存token
    setUser (state, user) {
      state.user = user // 赋值  然后再登录成功以后将数据存储到容器中
    }
  },
  actions: {

  }
})
