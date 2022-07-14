<template>
    <div>
        <el-color-picker
            v-model='defaultTheme'
            :predefine='["#409EFF", "#1890ff", "#304156","#212121","#11a983", "#13c2c2", "#6959CD", "#f5222d" ]'
            size='small'
            @change='changeTheme'
        />
    </div>
</template>
<script lang='ts' setup name="LayoutTheme">
import { ref } from 'vue'
import { useLayoutStore } from '/@/store/modules/layout'
import changeThemeColor from '/@/utils/changeThemeColor'

const { getSetting, removeAllCachedViews } = useLayoutStore()
const defaultTheme = ref(getSetting.color.primary)

const changeTheme = () => {
    changeThemeColor(defaultTheme.value)
    removeAllCachedViews()
}

</script>