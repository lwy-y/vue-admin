import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, localGetItem } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 5 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = localGetItem('token')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.retCode !== 200) {


      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014 || res.retCode === 401) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消以停留在此页面，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {

      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

/**
 * 封装 get 请求
 * @param {*请求地址} url
 * @param {*请求参数} params
 */
export const fetch = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    })
      .then(response => {
        // resolve(response.data);
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装 post 请求
 * @param {*请求地址} url
 * @param {*请求参数} data
 */
export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    service.post(url, data).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 封装 put 请求
 * @param {*请求地址} url
 * @param {*请求参数} data
 */
export const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    service.put(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete方法
 * @param {*请求地址} url
 * @param {*请求参数} params
 */
export const del = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    service.delete(url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const upload = (url, params) => {
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  return new Promise((resolve, reject) => {
    console.log(service)
    service.post(url, params, config
    )
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}
