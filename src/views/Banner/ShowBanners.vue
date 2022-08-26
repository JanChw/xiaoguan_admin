<template>
    <div class='flex justify-end align-center'>
        <div class='m-3'>
            <el-button type='danger' @click='handleDeletes'>批量删除</el-button>
        </div>
    </div>
    <el-table
        ref='multipleTableRef'
        :data='banners'
        style='width: 100%'
        table-layout='auto'
        @selection-change='handleSelectionChange'
    >
        <el-table-column type='selection' width='45' />
        <el-table-column label='日期'>
            <template #default='scope'><span>{{ new Date(scope.row.createdAt).toLocaleDateString() }}</span></template>
        </el-table-column>
        <el-table-column label='名称' prop='name' />
        <el-table-column label='标题' prop='title' />
        <el-table-column label='简述' prop='desc' />
        <el-table-column label='链接'>
            <template #default='scope'>
                <el-tag v-for='(key, val, index) in scope.row.links' :key='index'>
                    {{ val }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label='图片数'>
            <template #default='scope'>
                {{ scope.row.imgs.length }}
            </template>
        </el-table-column>
        <el-table-column fixed='right'>
            <template #header>
                <el-input
                    v-model.trim='search'
                    size='large'
                    placeholder='Type to search'
                    @keyup.enter='handleSearch'
                >
                    <template #append>
                        <el-button :icon='Search' @click='handleSearch' />
                    </template>
                </el-input>
            </template>
            <template #default='scope'>
                <div class='actions text-center'>
                    <el-button
                        size='small'
                        type='primary'
                        @click='handlePrew(scope.row.id)'
                    >预览</el-button>
                    <el-button
                        size='small'
                        type='danger'
                        @click='handleDelete(scope.row.id)'
                    >Delete</el-button>
                    <el-button size='small' type='info'>
                        <router-link :to='{ name: "updateFood", params: { id: scope.row.id }}'>
                            Update
                        </router-link>
                    </el-button>
                </div>
                
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model='dialogVisible' :title='banner.title' width='50%' draggable>
        <el-carousel indicator-position='outside' :type='carouselType'>
            <el-carousel-item v-for='img in banner.imgs' :key='img.id'>
                <img :src='MY_STATIC_SERVER+img.url'>
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, reactive } from 'vue'


import Http from '/@/api/http'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import { Banner, initBanner } from './index'
const { MY_STATIC_SERVER } = import.meta.env

let banners = ref<Banner[]>([])
const search = ref<string>('')
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const selected = ref<number[]>([])
const dialogVisible = ref(false)
let banner = reactive<Banner>(initBanner())
let carouselType = ref<'card'|undefined>()

const handleSelectionChange = (val: Banner[]) => {
  selected.value = val.map(banner => banner.id)
}

const handleSearch = async() => {
  const { entities } = await Http.get(`/api/banners/search?content=${search.value}`)
  console.log(entities)
  banners.value = entities
}

const handlePrew = async(id: number) => {
  const data = await Http.get(`/api/banner/${id}`)
  Object.assign(banner, data)
  dialogVisible.value = true
}

const handleDelete = async(id: number) => {
  const [, isCancled] = await Http.deleteWithMessageBox(`/api/banner/${id}`)
  !isCancled && loadFoods(banners)
}

const handleDeletes = async() => {
  console.log(selected.value)
  const [, isCancled] = await Http.deleteWithMessageBox('/api/banners', { data: { ids: selected.value } })
  !isCancled && loadFoods(banners)
}



onMounted(async() => {
  await loadFoods(banners)
})

async function loadFoods(foods: Ref<Banner[]>) {
  const { entities } = await Http.get('/api/banners')
  foods.value = entities
}
</script>


<style lang='postcss' scoped>
</style>
