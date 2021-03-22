

import { fetch, post, put, del } from '@/utils/request'

// 服务器网络配置列表
export function getInternet(data) {
  return post('/internet/getInternet', data)
}

// 设置服务器网络配置
export function setInternet(data) {
  return post('/internet/ServerInternetConfig', data)
}







