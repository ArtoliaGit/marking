import axios from '@/libs/api.request'

export const findVersionAll = () => {
  return axios.request({
    url: 'Version/findVersionAll',
    method: 'get'
  })
}

export const createVersion = (data) => {
  return axios.request({
    url: 'Version/createVersion',
    data,
    method: 'post'
  })
}

export const updateVersion = (data) => {
  return axios.request({
    url: 'Version/updateVersion',
    data,
    method: 'post'
  })
}
