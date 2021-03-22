import Cookies from 'js-cookie'
const localStorage = window.localStorage

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function localSetItem(key, value) {
  localStorage.setItem(key, value)
}

/**
 * localstroy 读取 key 
 * @param {*} key 
 */
export function localGetItem(key) {
  return localStorage.getItem(key)
}

/**
 * localstroy 删除 key 
 * @param {*} key 
 */
export function localRemoveItem(key) {
  localStorage.removeItem(key)
}

/**
 * 清除 localstroy
 */
export function localClear() {
  localStorage.clear();
}
