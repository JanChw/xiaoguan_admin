<template>
    <el-sub-menu v-if='menuList.children && menuList.children.length > 0' :key='menuList.path' :index='menuList.path'>
        <template #title>
            <component :is='UseElIcon(menuList.meta.icon || "el-icon-location")' />
            <span>{{ menuList.meta.title }}</span>
        </template>
        <el-menu-item-group>
            <menubar-item v-for='v in menuList.children' :key='v.path' :index='v.path' :menu-list='v' />
        </el-menu-item-group>
    </el-sub-menu>

    <el-menu-item
        v-else
        :key='menuList.path'
        :index='menuList.path'
    >
        <component :is='UseElIcon(menuList.meta.icon || "el-icon-setting")' />
        <template #title>
            {{ menuList.meta.title }}
        </template>
    </el-menu-item>
</template>

<script lang="ts" setup name="MenubarItem">
import { PropType } from 'vue'
import { IMenubarList } from '/@/type/store/layout'
import { UseElIcon } from '/@/components/SvnIcon/elIcon'

const props = defineProps({
    menuList: {
        type: Object as PropType<IMenubarList>,
        default: () => {return {}}
    }
})
   
</script>