<template>
    <div class='flex justify-end align-center'>
        <div>
            <div v-if='isRecyclePage'>
                <el-button type='danger' @click='handleDeletes'>批量删除</el-button>
                <el-button type='success' @click='handleRecover'>批量还原</el-button>
            </div>
            <div v-else>
                <el-button type='danger' @click='handleSoftDeletes'>批量删除</el-button>
            </div>
        </div>
    </div>
    <el-table ref='multipleTableRef' :data='foods' style='width: 100%' @selection-change='handleSelectionChange'>
        <el-table-column type='selection' width='45' />
        <el-table-column label='日期'>
            <template #default='scope'><span>{{ new Date(scope.row.createdAt).toLocaleDateString() }}</span></template>
        </el-table-column>
        <el-table-column label='名称' prop='name' />
        <el-table-column label='简要' prop='desc' />
        <el-table-column label='原价' prop='originPrice' />
        <el-table-column label='公开' prop='isPublished' />
        <el-table-column label='销售类型' prop='saleType' />
        <el-table-column fixed='right'>
            <template #header>
                <el-input
                    v-model.trim='search'
                    size='large'
                    placeholder='Type to search'
                    @keyup.enter='handleSearch(search)'
                >
                    <template #append>
                        <el-button :icon='Search' @click='handleSearch(search)' />
                    </template>
                </el-input>
            </template>
            <template v-if='isRecyclePage' #default='scope'>
                <el-button
                    size='small'
                    type='danger'
                    @click='handleDelete(scope.row.id)'
                >Delete</el-button>
            </template>
            <template v-else #default='scope'>
                <el-button
                    size='small'
                    type='danger'
                    @click='handleSoftDelete(scope.row.id)'
                >Delete</el-button>
                <router-link :to='{ name: "updateFood", params: { id: scope.row.id }}'>
                    <el-button
                        size='small'
                    >Update</el-button>
                </router-link>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'

import { useRoute } from 'vue-router'
import Http from '/@/api/http'
import { toNumber } from '/@/utils/tools'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import { Food } from '/@/type/models/food.interface'
const route = useRoute()
let foods = ref<Food[]>([])
const search = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const selected = ref<number[]>([])
const isRecyclePage = ref<boolean>(route.name === 'recycleBin')

const handleSelectionChange = (val: Food[]) => {
    selected.value = val.map(food => food.id)
    
}

const handleSearch = async(search: string) => {
    console.log(search)
    const _foods = await Http.GET(`/api/foods/search?content=${search}`)
    _foods.forEach((item:Food) => {
        item.originPrice = toNumber(item.originPrice)
    })
    foods.value = _foods
}

const handleDelete = async(id: number) => {
    await Http.DELETE(`/api/foods/${id}`)
    loadFoods(foods)
}

const handleDeletes = async() => {
    await Http.DELETE('/api/foods', { data: { ids: selected.value } })
    loadFoods(foods, 'recycle')
}

const handleRecover = async() => {
    console.log(selected)
    await Http.PUT('/api/foods', { data: { payload: { isDeleted: false }, ids: selected.value } })
    loadFoods(foods, 'recycle')
}

const handleSoftDelete = async(id: number) => {
    await Http.PUT(`/api/foods/${id}`, { data: { isDeleted: true } })
    loadFoods(foods)
}

const handleSoftDeletes = async() => {
    console.log(selected)
    await Http.PUT('/api/foods', { data: { payload: { isDeleted: true }, ids: selected.value } })
    loadFoods(foods)
}

onMounted(async() => {

    isRecyclePage.value ? await loadFoods(foods, 'recycle') : await loadFoods(foods)
})

async function loadFoods(foods: Ref<Food[]>, type?: string) {
    const data = await Http.GET(`/api/foods?type=${type}`)
    data.forEach((item:Food) => {
        item.originPrice = toNumber(item.originPrice)
    })
    foods.value = data
}



</script>
