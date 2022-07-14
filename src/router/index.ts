import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { IMenubarList } from '/@/type/store/layout'
import { components } from '/@/router/asyncRouter'

const Components:IObject<() => Promise<typeof import('*.vue')>> = Object.assign({}, components, {
    Layout: (() => import('/@/layout/index.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    Redirect: (() => import('/@/layout/redirect.vue')) as unknown as () => Promise<typeof import('*.vue')>,
    LayoutBlank: (() => import('/@/layout/blank.vue')) as unknown as () => Promise<typeof import('*.vue')>
})

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
        redirect: '/files/show',
        meta: { title: '文件管理', icon: 'el-icon-eleme' },
        children: [
            {
                name: '文件展示',
                path: '/files/show',
                component: Components['Show'],
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
        name: '内容管理',
        path: '',
        component: Components['Layout'],
        redirect: '/content/foods',
        meta: { title: '内容管理', icon: 'el-icon-eleme' },
        children: [
            {
                name: '菜品管理',
                path: '/content/foods',
                component: Components['Foods'],
                meta: { title: '菜品管理', icon: 'el-icon-tools' }
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
        redirect: '/users/show',
        meta: { title: '用户管理', icon: 'el-icon-eleme' },
        children: [
            {
                name: '用户管理',
                path: '/users/show',
                component: Components['Show'],
                meta: { title: '用户管理', icon: 'el-icon-tools' }
            },
            {
                name: '订单管理',
                path: '/users/order',
                component: Components['Order'],
                meta: { title: '订单管理', icon: 'el-icon-tools' }
            }
        ]
    },
    {
        name: '系统管理',
        path: '',
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