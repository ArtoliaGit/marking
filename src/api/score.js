import axios from '@/libs/api.request'

export const selectCountzf = (params) => {
  return axios.request({
    url: 'Statistics/selectCountzf',
    params: params,
    method: 'get'
  })
}

export const selectScoreByname = (params) => {
  return axios.request({
    url: 'Statistics/selectScoreByname',
    params: params,
    method: 'get'
  })
}

export const selectScoreByGrdf = (params) => {
  return axios.request({
    url: 'Statistics/selectScoreByGrdf',
    params: params,
    method: 'get'
  })
}

export const selectByMonthPm = (params) => {
  return axios.request({
    url: 'Statistics/selectByMonthPm',
    params: params,
    method: 'get'
  })
}

export const selectByPm = (params) => {
  return axios.request({
    url: 'Statistics/selectByPm',
    params: params,
    method: 'get'
  })
}

export const selectByPfr = (params) => {
  return axios.request({
    url: 'Statistics/selectByPfr',
    params: params,
    method: 'get'
  })
}

export const selectByLd = (params) => {
  return axios.request({
    url: 'Statistics/selectByLd',
    params: params,
    method: 'get'
  })
}
