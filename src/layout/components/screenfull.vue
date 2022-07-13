<template>
    <div class='hidden-xs-only px-2'>
        <svg-icon v-if='!isFullscreen' class-name='cursor-pointer' icon-class='svg-fullscreen' @click='changeScreenfull' />
        <svg-icon v-else class-name='cursor-pointer' icon-class='svg-exit-fullscreen' @click='changeScreenfull' />
        
        <!-- 切换失效 -->
        <!-- <svg-icon class-name='cursor-pointer' :icon-class='isFullscreen ? "svg-exit-fullscreen" : "svg-fullscreen"' @click='changeScreenfull' /> -->
    </div>
</template>
<script lang='ts' setup name="Screenfull">
import { ref, onMounted, onUnmounted } from 'vue'
import screenfull from 'screenfull'
import { ElNotification } from 'element-plus'

const isFullscreen = ref(false)
const changeScreenfull = () => screenfull.isEnabled ? screenfull.toggle() : ElNotification({
    message: '浏览器不支持全屏',
    type: 'warning'
})

const change = () => screenfull.isEnabled && (isFullscreen.value = screenfull.isFullscreen)

onMounted(() => screenfull.isEnabled && screenfull.on('change', change))
onUnmounted(() => screenfull.isEnabled && screenfull.off('change', change))
 
</script>