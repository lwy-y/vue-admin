
import { fetch, post, put, del } from '@/utils/request'

// 模块网络配置列表
export function showModule(data) {
  return post('/blade/showModule', data)
}

// 模块网络配置列表
export function showAllBlade(data) {
  return post('/blade/queryAllBlade', data)
}

// 模块网络配置
export function moduleConfig(data) {
  return post('/internet/ModuleInternetConfig', data)
}

// 模块电源状态配置
export function moduleChangePs(data) {
  return post('/module/changePs', data)
}

// 模块信息 by mid
export function getModuleById(data) {
  return fetch('/module/getModuleById', data)
}

// 获取模块状态
export function showEquipment(data) {
  return post('/equipment/show', data)
}

// 告警值查询
export function showAlarm() {
  return post('/alarm/show')
}
// 告警值查询
export function updateWarn(data) {
  return post('/alarm/modify', data)
}







