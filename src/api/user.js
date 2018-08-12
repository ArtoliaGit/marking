import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'SystemUser/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'SystemUser/get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'SystemUser/logout',
    method: 'post'
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: 'SystemUser/findUserAll',
    params: params,
    method: 'get'
  })
}

export const createUser = (data) => {
  return axios.request({
    url: 'SystemUser/createUser',
    data,
    method: 'post'
  })
}

export const updateUser = (data) => {
  return axios.request({
    url: 'SystemUser/updateUser',
    data,
    method: 'post'
  })
}

export const findUser = (params) => {
  return axios.request({
    url: 'SystemUser/findUser',
    params: params,
    method: 'get'
  })
}

export const findUserRelation = (params) => {
  return axios.request({
    url: 'UserRelation/findUserRelation',
    params: params,
    method: 'get'
  })
}

export const deleteUserRelation = (params) => {
  return axios.request({
    url: 'UserRelation/deleteUserRelation',
    params: params,
    method: 'get'
  })
}

export const createUserRelation = (data) => {
  return axios.request({
    url: 'UserRelation/createUserRelation',
    data,
    method: 'post'
  })
}

export const findNoUser = (params) => {
  return axios.request({
    url: 'SystemUser/findNoUser',
    params: params,
    method: 'get'
  })
}

export const cancelUserWx = (params) => {
  return axios.request({
    url: 'SystemUser/cancelUserWx',
    params: params,
    method: 'get'
  })
}

export const findItemRelation = (params) => {
  return axios.request({
    url: 'ItemRelation/findItemRelation',
    params: params,
    method: 'get'
  })
}

export const findNoItem = (params) => {
  return axios.request({
    url: 'ItemRelation/findNoItem',
    params: params,
    method: 'get'
  })
}

export const createItemRelation = (data) => {
  return axios.request({
    url: 'ItemRelation/createItemRelation',
    data,
    method: 'post'
  })
}

export const deleteItemRelation = (params) => {
  return axios.request({
    url: 'ItemRelation/deleteItemRelation',
    params: params,
    method: 'get'
  })
}

export const findScoreTemplate = (params) => {
  return axios.request({
    url: 'ScoreTemplate/findScoreTemplate',
    params: params,
    method: 'get'
  })
}

export const findScoreTemplateAll = () => {
  return axios.request({
    url: 'ScoreTemplate/findScoreTemplateAll',
    method: 'get'
  })
}

export const deleteScoreTemplate = (params) => {
  return axios.request({
    url: 'ScoreTemplate/deleteScoreTemplate',
    params: params,
    method: 'get'
  })
}

export const createScoreTemplate = (data) => {
  return axios.request({
    url: 'ScoreTemplate/createScoreTemplate',
    data,
    method: 'post'
  })
}

export const updateMbid = (params) => {
  return axios.request({
    url: 'UserRelation/updateMbid',
    params: params,
    method: 'get'
  })
}
