<template>
    
    <el-space direction='vertical' alignment='flex-start'>
        <div class='fixed w-4/5 mt-3'>
            <el-form :inline='true' class='flex justify-between mr-10'>
                <div>
                    <el-form-item label=''>
                        <el-input v-model='search' placeholder='搜索图片' @keyup.enter='onSearchImages' />
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='onSearchImages'>搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-show='batch' type='danger' @click='onDelImages'>批量删除</el-button>
                    </el-form-item>
                </div>
                <el-switch
                    v-model='batch'
                    size='large'
                    style='--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66'
                    active-text='批量删除'
                    @click='onBatchToggleIndicator'
                />
            </el-form>
        </div>
        <el-skeleton v-if='lists.length' :loading='loading' animated :count='9' class='flex justify-center align-middle flex-wrap gap-4'>
            <template #template>
                <el-skeleton-item variant='image' style='width: 400px; height: 267px' />
                <div style='padding: 14px'>
                    <el-skeleton-item variant='h3' style='width: 50%' />
                    <div class='flex'>
                        <el-skeleton-item variant='text' style='margin-right: 16px' />
                        <el-skeleton-item variant='text' style='width: 30%' />
                    </div>
                </div>
            </template>
            <template #default>
                <el-checkbox-group v-model='selected' class='flex flex-wrap mt-16'>
                    <el-card
                        v-for='item in lists'
                        :key='item.id'
                    >
                        <div class='card-body'>
                            <div class='flex relative'>
                                <div class='del absolute right-0 z-50' :data-filename='item.name' @click='onDelImage'>
                                    <el-icon :size='25' class='del-icon'>
                                        <el-icon-delete />
                                    </el-icon>
                                </div>
                            </div>
                            <img :src='item.imgUrl'>
                        </div>
                        <div class='relative'>
                            <span>{{ item.originalName }}</span>
                            <div class='bottom card-header'>
                                <div class='time'>{{ currentDate }}</div>
                            </div>
                            <div class='absolute right-0 bottom-0'>
                                <el-checkbox :key='item.id' :label='item.name' />
                            </div>
                            <div class='collection'>
                                <el-icon v-if='item.isCollected' :size='25'>
                                    <el-icon-star-filled class='text-red-300' @click='cancleFromCollected(item.id)' />
                                </el-icon>
                                <el-icon v-else :size='25'>
                                    <el-icon-star class='text-red-300' @click='addToCollected(item.id)' />
                                </el-icon>
                            </div>
                        </div>
                    </el-card>
                </el-checkbox-group>
            </template>
        </el-skeleton>
        <div v-else>服务器上没有图片</div>
    </el-space>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import API from '/@/api'
const url = '/api/files/test'
const update_url = '/api/files'
const STATIC_SERVER = 'http://localhost:8080'



interface ListItem {
    imgUrl: string
    name: string
    originalName: string
    id: number
    isCollected: boolean
}

interface CollectionItem { 
    isCollected: boolean
}

const batch = ref<boolean>(false)
const search = ref<string>('')
const loading = ref(true)
const lists = ref<ListItem[]>([])
const selected = ref<string[]>([])
const currentDate = new Date().toDateString()

const onBatchToggleIndicator = () => {
    const els = document.querySelectorAll('.el-checkbox__input')
    els.forEach(el => {
        !el.style.display && (el.style.display = 'none')
        const displayValue = 'none' === el.style.display ? 'inline-flex' : 'none'
        console.log(displayValue)
        el.style.display = displayValue
    })
}

const onSearchImages = async() => {
    const _url = `${url}?name=${search.value}`
    console.log(_url)
    await searchImagesByName(_url)
}

const onDelImages = async() => {
    const data = { filenames: Array.from(selected.value) }
    await API.DELETE(url, { data })

    await loadImages(url)
}

const onDelImage = async(el) => {
    const { filename } = el.target.dataset
    const data = { filenames: [filename] }
    await API.DELETE(url, { data })
    
    await loadImages(url)
}

const opCollection = (data: CollectionItem) => async(id: number) => {
    
    await API.PUT(`${update_url}/${id}`, { data })
    await loadImages(url)
}

const cancleFromCollected = opCollection({ isCollected: false })
const addToCollected = opCollection({ isCollected: true })


const imageFun = (_loading: Ref<boolean>, _lists: Ref<ListItem[]>) => async(url: string, opts = {}) => {
    _loading.value = true
    const data = await API.GET(url, opts)
    const images = data.map(image => {
        let [ originalName ] = image.originName.split('.')
        if (originalName.length > 15) {
            originalName = `${originalName.slice(0, 15)}...`
        }
        const imgUrl = `${STATIC_SERVER}${image.url}`
        return { originalName, imgUrl, id:image.id, name: image.filename, isCollected: image.isCollected }
    })
    _lists.value = images
    _loading.value = false
}

const searchImagesByName = imageFun(loading, lists)

const loadImages = imageFun(loading, lists)

onMounted(async() => {
    await loadImages(url)

})
</script>

<style lang='postcss' scoped>
    ::v-deep(.el-space__item) {
        width: 100%;
    }

    ::v-deep(.el-switch__label.is-active) {
        color: #ff4949;
    }

    ::v-deep(.el-checkbox__input), ::v-deep(.el-checkbox__label) {
        display: none;
    }

    .el-checkbox-group {
        font-size:inherit;
        line-height:normal;
    }

    .el-card.is-always-shadow {
        margin: 4px;
        flex:0 0 calc(20% - 10px);
    }

    .card-body:hover .el-icon.del-icon {
        display: inline-flex;
        cursor: pointer;
    }

    .el-icon.del-icon {
        position: relative;
        z-index: -1;
        color: #ff4949;
        display:none;
    }

</style>
