import request from '@/utils/request'
import { fetch, post, put, del } from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }
export function login(data) {
  return post('/user/login', {
    uname: data.username,
    upassword: data.password
  })
}

// 获取全部用户
export function getUserList() {
  return post('/user/show')
}

// 保存用户信息
export function saveUser(data) {
  return post('/user/saveOrUpdate', data)
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


