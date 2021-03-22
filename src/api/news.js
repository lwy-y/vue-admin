
import { fetch, post, put, del } from '@/utils/request'

// 消息警告列表
export function caveatShow(data) {
  return post('/caveat/show', data)
}