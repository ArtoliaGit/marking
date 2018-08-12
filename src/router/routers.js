import Main from '@/view/main'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          hideInMenu: true,
          notCache: true,
          title: '首页'
        },
        component: () => import('@/view/home/home.vue')
      }
    ]
  },
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      icon: 'ios-people',
      title: '用户管理',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: 'registered',
        name: 'registered',
        meta: {
          icon: 'android-person-add',
          title: '用户注册'
        },
        component: () => import(/* webpackChunkName: "my-chunk-name" */'@/view/userManage/userManage.vue')
      },
      {
        path: 'related',
        name: 'related',
        meta: {
          icon: 'android-person-add',
          title: '用户关联'
        },
        component: () => import('@/view/userManage/userRelated.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'ios-list',
      title: '评分统计',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: 'scoreCount',
        name: 'scoreCount',
        meta: {
          icon: 'ios-list-outline',
          title: '得分汇总'
        },
        component: () => import('@/view/statistics/scoreCount.vue')
      },
      {
        path: 'monthRank',
        name: 'monthRank',
        meta: {
          icon: 'ios-list-outline',
          title: '指标统计'
        },
        component: () => import('@/view/statistics/monthRank.vue')
      },
      {
        path: 'monthRankCount',
        name: 'monthRankCount',
        meta: {
          icon: 'ios-list-outline',
          title: '月排名'
        },
        component: () => import('@/view/statistics/monthRankCount.vue')
      },
      {
        path: 'yearRankCount',
        name: 'yearRankCount',
        meta: {
          icon: 'ios-list-outline',
          title: '年排名'
        },
        component: () => import('@/view/statistics/yearRankCount.vue')
      },
      {
        path: 'leaderRank',
        name: 'leaderRank',
        meta: {
          icon: 'ios-list-outline',
          title: '领导得分汇总'
        },
        component: () => import('@/view/statistics/leaderRank.vue')
      }
    ]
  },
  {
    path: '/dic',
    name: 'dic',
    meta: {
      icon: 'ios-gear',
      title: '字典维护',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: 'department',
        name: 'department',
        meta: {
          icon: 'android-list',
          notCache: true,
          title: '部门维护'
        },
        component: () => import('@/view/dicManage/department.vue')
      },
      {
        path: 'indexManage',
        name: 'indexManage',
        meta: {
          icon: 'android-list',
          notCache: true,
          title: '评价项维护'
        },
        component: () => import('@/view/dicManage/indexManage.vue')
      },
      {
        path: 'scoreTemplate',
        name: 'scoreTemplate',
        meta: {
          icon: 'android-list',
          notCache: true,
          title: '模板维护'
        },
        component: () => import('@/view/dicManage/scoreTemplate.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/error-page/404.vue')
  }
]
