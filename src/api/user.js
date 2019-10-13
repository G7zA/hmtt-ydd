
/**
 * 1.接口重用可以直接调用
 * 2.接口维护方便
 * 封装用户接口相关请求模块 */

import request from '@/utils/request' // 导入封装好的axios请求 （我们叫request）
//  登录
export function login (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
//  注册
// export function register () {
// }
