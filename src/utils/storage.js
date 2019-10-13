// 第四步 单独封装一个本地存储的存储模块 专门操作本地存储的API模块
// 获取token
export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name))
}
// 设置token
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}
// 删除token
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
