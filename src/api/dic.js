import axios from '@/libs/api.request'

/**
 *查询部门字典
 */
export const getDepartment = (params) => {
  return axios.request({
    url: 'Department/findAll',
    params: params,
    method: 'get'
  })
}

export const createDepartment = (data) => {
  return axios.request({
    url: 'Department/createDepartment',
    data,
    method: 'post'
  })
}

export const updateDepartment = (data) => {
  return axios.request({
    url: 'Department/updateDepartment',
    data,
    method: 'post'
  })
}

/**
 *查询评分项
 */
export const findScoreItem = (params) => {
  return axios.request({
    url: 'ScoreItem/findScoreItem',
    params: params,
    method: 'get'
  })
}

/**
 *新建评分项
 */
export const createScoreItem = (data) => {
  return axios.request({
    url: 'ScoreItem/createScoreItem',
    data,
    method: 'post'
  })
}

/**
 *更新评分项
 */
export const updateScoreItem = (data) => {
  return axios.request({
    url: 'ScoreItem/updateScoreItem',
    data,
    method: 'post'
  })
}
