import { fetch, post, put, del } from '@/utils/request'

export function systemShow(data) {
  return fetch('/system/show')
}
export function changePsC() {
  return post('/system/changePsC')
}
export function changeCaveat(data) {
  return post('/system/changePsCaveat', data)
}

