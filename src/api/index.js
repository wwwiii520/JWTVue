import request from '../utils/request'

export function login(data) {
  return request({
    url: '/api/Auth/GetToken',
    method: 'post',
    data 
  })
}

export function refreshToken(accessToken, refreshToken) {
  const data = { accessToken: accessToken, refreshToken: refreshToken }
  return request({
    url: '/api/Auth/RefreshToken',
    method: 'post',
    data
  })
}

export function test(i) {
  return request({
    url: '/api/Auth/Test',
    method: 'get',
    params: {i:i}
  })
}