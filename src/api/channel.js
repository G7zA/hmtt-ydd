/** 频道列表相关接口模块 */

import request from '@/utils/request' // 引入封装好的axios请求模块
/** 获取默认推荐的频道列表 */
export function defaultChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
