import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { IMenubarList } from '/@/type/store/layout'
import { components } from '/@/router/asyncRouter'

const Components:IObject<() => Promise<typeof import('*.vue')>> = Object.assign({}, components, {
  Layout: (() => import('/@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>,
  Redirect: (() => import('/@/layout/redirect.vue')) as unknown as () => Promise<typeof import('*.vue')>,
  LayoutBlank: (() => import('/@/layout/blank.vue')) as unknown as () => Promise<typeof import('*.vue')>
})

console.log(Components)

// 静态路由页面
export const allowRouter:Array<IMenubarList> = [
  {
    name: 'Dashboard',
    path: '/',
    component: Components['Layout'],
    redirect: '/dashboard/workplace',
    meta: { title: '仪表盘', icon: 'el-icon-eleme' },
    children: [
      {
        name: 'Workplace',
        path: '/dashboard/workplace',
        component: Components['Workplace'],
        meta: { title: '工作台', icon: 'el-icon-tools' }
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: Components.Login,
    meta: { title: '登录', icon: 'el-icon-eleme', hidden: true }
  },
  {
    name: '文件管理',
    path: '',
    component: Components['Layout'],
    redirect: '/files',
    meta: { title: '文件管理', icon: 'el-icon-eleme' },
    children: [
      {
        name: '文件展示',
        path: '/files',
        component: Components['Files'],
        meta: { title: '文件展示', icon: 'el-icon-tools' }
      },
      {
        name: '文件上传',
        path: '/files/upload',
        component: Components['Upload'],
        meta: { title: '文件上传', icon: 'el-icon-tools' }
      }
    ]
  },
  {
    name: '广告栏管理',
    path: '',
    component: Components['Layout'],
    redirect: '/banners',
    meta: { title: '广告栏管理', icon: 'el-icon-eleme' },
    children: [
      {
        name: '广告栏展示',
        path: '/banners',
        component: Components['ShowBanners'],
        meta: { title: '广告栏', icon: 'el-icon-tools' }
      },
      {
        name: '新建广告栏',
        path: '/banner/create',
        component: Components['CreateBanner'],
        meta: { title: '新建广告栏', icon: 'el-icon-tools' }
      },
      {
        name: '更新广告栏',
        path: '/banner/:id/update',
        component: Components['UpdateBanner'],
        meta: { title: '更新广告栏', icon: 'el-icon-tools', hidden: true }
      },
      {
        name: '广告栏详情',
        path: '/banner/:id/detail',
        component: Components['ShowBanner'],
        meta: { title: '广告栏详情', icon: 'el-icon-tools', hidden: true }
      }
    ]
  },
  {
    name: '内容管理',
    path: '/content',
    component: Components['Layout'],
    meta: { title: '内容管理', icon: 'el-icon-eleme' },
    children: [
      {
        name: '菜品管理',
        path: 'foods',
        component: Components['Foods'],
        meta: { title: '菜品管理', icon: 'el-icon-tools' },
        children: [
          {
            name: 'showFoods',
            path: '/content/foods',
            component: Components['ShowFoods'],
            meta: { title: '菜品展示', icon: 'el-icon-tools' }
          },
                  
          {
            name: 'showFood',
            path: '/content/food/:id',
            component: Components['ShowFood'],
            meta: { title: '菜品展示', icon: 'el-icon-tools', hidden: true }
          },
          {
            name: 'createFood',
            path: '/content/food/create',
            component: Components['CommonFood'],
            meta: { title: '添加菜品', icon: 'el-icon-tools' }
          },
          {
            name: 'updateFood',
            path: '/content/food/update/:id',
            component: Components['CommonFood'],
            meta: { title: '修改菜品', icon: 'el-icon-tools', hidden: true }
          },
          {
            name: 'foodsBin',
            path: '/content/foods/bin',
            component: Components['ShowFoods'],
            meta: { title: '菜品回收', icon: 'el-icon-tools' }
          }
        ]
      },
      {
        name: '社区服务管理',
        path: '/content/services',
        component: Components['Services'],
        meta: { title: '社区服务管理', icon: 'el-icon-tools' }
      }
    ]
  },
  {
    name: '用户管理',
    path: '',
    component: Components['Layout'],
    redirect: '/users',
    meta: { title: '用户管理', icon: 'el-icon-eleme' },
    children: [
      {
        name: 'showUsers',
        path: '/users',
        component: Components['ShowUsers'],
        meta: { title: '用户管理', icon: 'el-icon-tools' }
      },
      {
        name: 'showUser',
        path: '/user/:id',
        component: Components['ShowUser'],
        meta: { title: '用户详情', icon: 'el-icon-tools', hidden: true }
      },
      {
        name: 'showOrders',
        path: '/orders',
        component: Components['ShowOrders'],
        meta: { title: '订单管理', icon: 'el-icon-tools' }
      },
      {
        name: 'showOrder',
        path: '/order/:id',
        component: Components['ShowOrder'],
        meta: { title: '订单详情', icon: 'el-icon-tools', hidden: true }
      }
    ]
  },
  {
    name: '系统管理',
    path: '/system/staff',
    component: Components['Layout'],
    redirect: '/system/staff',
    meta: { title: '系统管理', icon: 'el-icon-eleme' },
    children: [
      {
        name: '职工管理',
        path: '/system/staf',
        component: Components['Staff'],
        meta: { title: '职工管理', icon: 'el-icon-tools' }
      },
      {
        name: '角色管理',
        path: '/system/role',
        component: Components['Role'],
        meta: { title: '角色管理', icon: 'el-icon-tools' }
      },
      {
        name: '权限管理',
        path: '/system/permission',
        component: Components[' Permission'],
        meta: { title: '权限管理', icon: 'el-icon-tools' }
      }
    ]
  },
  {
    name: 'RedirectPage',
    path: '/redirect',
    component: Components['Layout'],
    meta: { title: '重定向页面', icon: 'el-icon-eleme', hidden: true },
    children: [
      {
        name: 'Redirect',
        path: '/redirect/:pathMatch(.*)*',
        meta: {
          title: '重定向页面',
          icon: ''
        },
        component: Components.Redirect
      }
    ]
  },
  {
    name: 'ErrorPage',
    path: '/ErrorPage',
    meta: { title: '错误页面', icon: 'el-icon-eleme' },
    component: Components.Layout,
    redirect: '/ErrorPage/404',
    children: [
      {
        name: '401',
        path: '/ErrorPage/401',
        component: Components['401'],
        meta: { title: '401', icon: 'el-icon-tools' }
      },
      {
        name: '404',
        path: '/ErrorPage/404',
        component: Components['404'],
        meta: { title: '404', icon: 'el-icon-tools' }
      }
    ]
  }
   
]

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory
  routes: allowRouter as RouteRecordRaw[]
})

export default router