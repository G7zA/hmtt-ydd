/** 文章列表相关接口模块 */

import request from '@/utils/request' // 引入封装好的axios请求模块
/** 获取频道列表 */
export function getArticelsList (params) {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
