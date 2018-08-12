import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'
import { getDepartment, findScoreItem } from '@/api/dic'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    departmentDic: {},
    indexDic: {}
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setDepartmentDic (state, dic) {
      state.departmentDic = dic
    },
    setIndexDic (state, dic) {
      state.indexDic = dic
    }
  },
  actions: {
    handleGetDepartmentDic ({state, commit}) {
      return new Promise((resolve, reject) => {
        getDepartment({'status': '0'}).then(res => {
          let data = res.data
          let department = {}
          data.forEach(element => {
            department[element.code] = element.name
          })
          commit('setDepartmentDic', department)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleGetIndexDic ({state, commit}) {
      return new Promise((resolve, reject) => {
        findScoreItem({'status': '0'}).then(res => {
          let data = res.data
          let zbdic = {}
          data.forEach(element => {
            zbdic[element.zbid] = element.zbmc
          })
          commit('setIndexDic', zbdic)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
