import axios from 'axios' // 导入axios
import jsonBig from 'json-bigint' // 导入json-bigint 将后端返回数据处理

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

// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
