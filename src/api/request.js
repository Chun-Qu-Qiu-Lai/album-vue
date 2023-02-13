import axios from 'axios'
import cache from '@/plugins/cache.js'

import { message } from 'ant-design-vue'
import { getToken } from '@/utils/token'
const service = axios.create({
  baseURL: 'http://localhost:5206',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false

  // 是否需要防止数据重复提交
  const isRepeatSubmit = false
  if (getToken() && !isToken) {
    config.headers.Authorization = 'Bearer ' + getToken()
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const url = sessionObj.url // 请求地址
      const data = sessionObj.data // 请求数据
      const time = sessionObj.time // 请求时间
      const interval = 1000 // 间隔时间(ms)，小于此时间视为重复提交
      if (data === requestObj.data && requestObj.time - time < interval && url === requestObj.url) {
        const msg = '数据正在处理，请勿重复提交'
        message.error(msg)
        return Promise.reject(msg)
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(res => {
  return res
},
error => {
  return Promise.reject(error)
}
)

export default service
