<template>
    <div class='table-search flex flex-col'>
        <div ref='searchEl' class='table-search-form'>
            <slot name='search' />
        </div>
        
        <div class='flex justify-between items-center mb-2'>
            <div>
                <el-button-group>
                    <el-button type='primary' icon='el-icon-edit' />
                    <el-button type='primary' icon='el-icon-share' />
                    <el-button type='primary' icon='el-icon-delete' />
                </el-button-group>
            </div>
            <el-button type='text' @click='toggleSearch'>
                高级搜索
                <el-icon>
                    <el-icon-arrow-up v-if='isShow' />
                    <el-icon-arrow-down v-else />
                </el-icon>
            </el-button>
        </div>
        <slot />
        <el-pagination
            :current-page='currentPage'
            :page-sizes='[10, 20, 50, 100]'
            :page-size='pageSize'
            layout='total, sizes, prev, pager, next, jumper'
            :total='total'
            @size-change='handleSizeChange'
            @current-change='handleCurrentChange'
        />
    </div>
</template>

<script lang="ts" setup name="TableSearch">
import { ref } from 'vue'
import { slide } from '/@/utils/animate'

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        default: 0
    }
})

const searchEl = ref(null)
   
const emit = defineEmits(['size-change', 'current-change'])

const isShow = ref(false)
const handleSizeChange = (v:any) => emit('size-change', v)
const handleCurrentChange = (v: any) => emit('current-change', v)
const toggleSearch = () => {
    isShow.value = !isShow.value
    slide(searchEl, isShow.value)
}
        
</script>

<style lang="postcss" scoped>
.table-search-form {
    overflow: hidden;
    height: 0;
}
</style>