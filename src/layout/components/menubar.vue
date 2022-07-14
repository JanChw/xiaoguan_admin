<template>
    <el-menu
        :mode='getMenubar.isPhone ? "vertical" : getSetting.mode'
        :default-active='activeMenu'
        :collapse='getMenubar.status === 1 || getMenubar.status === 3'
        :class='{ 
            "el-menu-vertical-demo": true,
            "w-64": getMenubar.status === 0 || getMenubar.status === 2, 
            "w-0": getMenubar.status === 3, 
            "w-16": getMenubar.status === 1, 
            "w-full": getSetting.mode === "horizontal" && !getMenubar.isPhone, 
        }'
        :collapse-transition='false'
        :unique-opened='true'
        @select='onOpenChange'
    >
        <menubar-item v-for='v in filterMenubarData' :key='v.path' :index='v.path' :menu-list='v' />
    </el-menu>
</template>

<script lang='ts' setup name="LayoutMenubar">
import { computed } from 'vue'
import MenubarItem from '/@/layout/components/menubarItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { IMenubarList } from '/@/type/store/layout'
import { useLayoutStore } from '/@/store/modules/layout'

// 过滤隐藏的菜单，并提取单条的子菜单
const filterMenubar = (menuList:IMenubarList[]) => {
    const f = (menuList:IMenubarList[]) => {
        let arr:IMenubarList[] = []
        menuList.filter(v => !v.meta.hidden).forEach(v => {
            let child = v.children && v.children.filter(v => !v.meta.hidden)
            let currentItem = v
            if(!v.meta.alwaysShow && child && child.length === 1) {
                [currentItem] = child
            }
            arr.push(currentItem)
            if(currentItem.children && currentItem.children.length > 0) {
                arr[arr.length - 1].children = f(currentItem.children)
            }
        })
        return arr
    }
    return f(menuList)
}

const route = useRoute()
const router = useRouter()
const { getMenubar, setRoutes, changeCollapsed, getSetting } = useLayoutStore()
console.log(getMenubar.menuList)
const filterMenubarData = filterMenubar(getMenubar.menuList)
setRoutes(filterMenubarData)

const activeMenu = computed(() => {
    if(route.meta.activeMenu) return route.meta.activeMenu
    return route.path
})
const onOpenChange = (d: any) => {
    router.push({ path: d })
    getMenubar.status === 2 && changeCollapsed()
}
       
</script>