import axios from 'axios' // 导入axios
import jsonBig from 'json-bigint' // 导入json-bigint 将后端返回数据处理
import store from '@/store' // 导入存储token的容器 非组件模块访问容器直接加载引入就可以了
// axios.create 方法
// 建议使用 create 方式，我们可以拥有
// 说白了就是复制了一个 axios，拥有和 axios 完全一样的功能，但是配置可以不一样
// 例如我们可以创建多个请求对象，而不同的请求对象拥有不同的 baseURL
// 例如我们可以有 a 请求的拦截器，也可以专门定制 b 请求的拦截器

// 封装 axios 请求函数 这里我们直接把 axios 封装为一个请求模块，在需要的时候直接加载使用
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 配置处理后端返回数据中超出 js 安全整数范围问题
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {} // 换了一个转化方法 使得 计算更精确 保证id不失真
}]

/**
 * 请求拦截器，（请求到达后台之前拦截）统一注入token
 */
request.interceptors.request.use(function (config) {
  // 在发起请求请做一些业务处理
  // config是要发送请求的配置信息
  // 定义user对象从容器中先拿到请求成功后的数据user对象
  const user = store.state.user
  // 判断如果token存在
  // console.log(2, user, 1)
  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}` // 统一注入token 到headers属性 因为所有接口要求的token格式是一样的
  }
  return config
}, function (error) {
  // 对请求失败做处理
  return Promise.reject(error)
})

// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
