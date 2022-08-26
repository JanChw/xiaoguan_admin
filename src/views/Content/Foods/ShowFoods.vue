<template>
    <div class='flex justify-end align-center'>
        <div class='m-3'>
            <div v-if='isRecyclePage'>
                <el-button type='danger' @click='deleteFoods'>批量删除</el-button>
                <el-button type='success' @click='recoverFoods'>批量还原</el-button>
            </div>
            <div v-else>
                <el-button type='danger' @click='softDeleteFoods'>批量删除</el-button>
            </div>
        </div>
    </div>
    <el-table
        ref='multipleTableRef'
        :data='data'
        style='width: 100%'
        table-layout='auto'
        @selection-change='handleSelectionChange'
    >
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
                    @keyup.enter='searchFoods'
                >
                    <template #append>
                        <el-button :icon='Search' @click='searchFoods' />
                    </template>
                </el-input>
            </template>
            <template v-if='isRecyclePage' #default='scope'>
                <el-button
                    size='small'
                    type='danger'
                    @click='deleteFood(scope.row.id)'
                >Delete</el-button>
            </template>
            <template v-else #default='scope'>
                <div class='text-center'>
                    <el-button
                        size='small'
                        type='danger'
                        @click='softDeleteFood(scope.row.id)'
                    >Delete</el-button>
                    <el-button
                        size='small'
                    >
                        <router-link :to='{ name: "updateFood", params: { id: scope.row.id }}'>
                            Update
                        </router-link>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import { useLoadData } from '/@/common/useLoadEntities'

let {
  data,
  selected, 
  search, 
  handleSearch, 
  handleDelete,
  handleDeletes,
  loadEntities,
  handleSelectionChange,
  handleSoftDelete,
  handleSoftDeletes,
  handleRecover
} = useLoadData()
const route = useRoute()
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const isRecyclePage = ref<boolean>(route.name === 'foodsBin')

const loadArgs = {
  url: '/api/foods',
  opts: { query: { isDeleted: isRecyclePage.value } }
}

const deleteFood = async(id: number) => {
  const delArgs = {
    url: '/api/food/:id',
    opts: { params: { id } }
  }
  await handleDelete(delArgs, loadArgs)
}

const searchFoods = async() => {
  const searchArgs = {
    url: '/api/foods/search',
    opts: { 
      query: {
        content: search.value,
        isDeleted: isRecyclePage.value
      } 
    }
  }
  await handleSearch(searchArgs)
}

const deleteFoods = async() => {
  await handleDeletes('/api/foods', loadArgs)
}

const recoverFoods = async() => {
  const updatesArgs = { 
    url: '/api/foods',
    opts: { data: { payload: { isDeleted: false }, ids: selected.value } }
  }
  await handleRecover(updatesArgs, loadArgs)
}

const softDeleteFood = async(id: number) => {
  const delArgs = {
    url: '/api/food/:id',
    opts: { params: { id },data: { isDeleted: true } }
  }
  await handleSoftDelete(delArgs, loadArgs)
}

const softDeleteFoods = async() => {
  const updatesArgs = { 
    url: '/api/foods',
    opts: { data: { payload: { isDeleted: true },ids: selected.value }
    }
  }

  await handleSoftDeletes(updatesArgs, loadArgs)
}

onMounted(async() => {
  await loadFoods()
})

async function loadFoods() {
  loadEntities(loadArgs)
}



</script>
