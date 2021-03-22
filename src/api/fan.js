
import { fetch, post, put, del } from '@/utils/request'

export function fanShow() {
  return post('/fan/show')
}
export function modifyFan(data) {
  return post('/fan/modifyFanById', data)
}