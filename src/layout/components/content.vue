<template>
    <el-scrollbar>
        <router-view v-slot='{ Component }'>
            <transition name='fade-transform' mode='out-in'>  
                <keep-alive :include='setting.showTags ? data.cachedViews : []'>
                    <component :is='Component' :key='key' class='page m-3 relative' />
                </keep-alive>
            </transition>
        </router-view>
        <el-backtop target='.layout-main-content>.el-scrollbar>.el-scrollbar__wrap' :bottom='15' :right='15'>
            <div><el-icon><el-icon-caret-top /></el-icon></div>
        </el-backtop>
    </el-scrollbar>
</template>

<script lang='ts' setup name="LayoutContent">
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '/@/store/modules/layout'

const route = useRoute()
const { getSetting, getTags } = useLayoutStore()
const setting = getSetting
const key = computed(() => route.path)

let data = reactive({
    cachedViews: [...getTags.cachedViews]
})
// keep-alive的include重新赋值，解决bug https://github.com/vuejs/vue-next/issues/2550
watch(
    () => getTags.cachedViews.length,
    () => data.cachedViews = [...getTags.cachedViews]
)

</script>

<style lang='postcss' scoped>


::v-deep(.el-scrollbar__view) {
    margin-top: 10px;
    height:100%;
    overflow-x: hidden;
}
::v-deep(.el-card) {
    overflow: visible;
}

/* ::v-deep(.el-scrollbar__view) {
    height: 100%;
} */

.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>