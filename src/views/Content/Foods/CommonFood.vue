<template>
    <div class='flex justify-around'>
        <div class='w-3/5'>
            <el-form :model='food' label-width='120px'>
                <el-form-item label='名称' class='w-1/2'>
                    <el-input v-model.trim='food.name' />
                </el-form-item>

                <el-form-item label='原价' class='w-1/2'>
                    <el-input v-model.trim='food.originPrice'>
                        <template #append>&yen;</template>
                    </el-input>
                </el-form-item>

                <el-form-item label='上传图片'>
                    <el-upload
                        ref='uploadRef'
                        @change='uploadImage'
                    >
                        <img v-if='food.imgUrl' :src='image_url' class='h-20'>
                        <div v-else class='flex w-20 h-20 border-dashed border border-gray-500 justify-center items-center'>
                            <el-icon><el-icon-plus /></el-icon>
                        </div>
                    </el-upload>
                </el-form-item>

                <el-form-item label='简要介绍' class='w-4/5'>
                    <el-input v-model='food.desc' type='textarea' show-word-limit maxlength='50' />
                </el-form-item>

                <!-- TODO:宽度不能响应 -->
                <el-form-item label='详情'>
                    <tiny-editor
                        id='editor'
                        v-model='food.detail'
                        :api-key='mykey'
                        :init='editorOption'
                    />
                </el-form-item>

                <el-form-item>
                    <el-button v-if='isUpdatePage' type='primary' @click='onUpdateFood(food.id, food)'>Update</el-button>
                    <el-button v-else type='primary' @click='onCreateFood'>Create</el-button>
                
                    <el-button>Cancel</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div v-if='isUpdatePage'>
            <p>添加食品属性</p>
            <el-table :data='specs' style='width: 100%' max-height='250'>
                <el-table-column label='日期' width='120'>
                    <template #default='scope'><span>{{ new Date(scope.row.createdAt).toLocaleDateString() }}</span></template>
                </el-table-column>
                <el-table-column prop='name' label='名称' width='120' />
                <el-table-column prop='price' label='价格' width='120' />
                <el-table-column fixed='right' label='Operations' width='120'>
                    <template #default='scope'>
                        <el-button
                            link
                            type='danger'
                            size='small'
                            @click.prevent='onDeleteSpec(scope.row.id)'
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class='flex border border-gray-300 border-solid mt-10'>
                <input v-model='spec.name' type='text' placeholder='名称' class='w-1/2 h-8 outline-none pl-2'>
                <div class='border-r border-gray-300 border-solid' />
                <input v-model='spec.price' type='text' placeholder='价格' class='w-1/2 h-8 outline-none pl-2'>
            </div>

            <el-button
                class='mt-4'
                style='width: 100%'
                @click='onAddSpec'
            >添加属性</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import TinyEditor from '@tinymce/tinymce-vue'
import type { UploadFile } from 'element-plus'
import { reactive, ref, computed, onMounted, Ref } from 'vue'
import { useRoute } from 'vue-router'
import API from '/@/api'
import { STATIC_SERVER } from '/@/config'
import { mykey, editorOption } from '/@/config/tinymce'
import { toNumber } from '/@/utils/tools'

import { Food } from '/@/type/models/food.interface'
import { Spec } from '/@/type/models/spec.interface'
const route = useRoute()
let food = reactive<Food>({
    name: '',
    desc: '',
    detail: '',
    imgUrl: '',
    originPrice: ''

})

const specs = ref<Spec[]>([])
const spec = reactive<Spec>({
    foodId: Number(route.params.id),
    name: '',
    price: ''
})
const image_url = computed(() => `${STATIC_SERVER}${food.imgUrl}`)

const isUpdatePage = ref<boolean>(route.name === 'updateFood')


const onAddSpec = async() => {
    const isExisted = specs.value.some(({ name }) => name === spec.name)
    if (isExisted) throw new Error('属性名已存在')
    await API.POST('/api/specs', { data: spec })
    Object.assign(spec, { name: '', price: '' })
    loadFood(food, specs)

}

const onDeleteSpec = async(id: number) => {
    await API.DELETE(`/api/specs/${id}`)
    loadFood(food, specs)
}

const uploadImage = async(uploadFile: UploadFile) => {
    const [image] = await API.uploadImages('test', [uploadFile.raw])
    food.imgUrl = image.url
}

const onUpdateFood = async(id: number, data: Partial<Food>) => {
    const _food = await API.PUT(`/api/foods/${id}`, { data })
    _food.originPrice = toNumber(_food.originPrice)
    Object.assign(food, _food)
}

const onCreateFood = async() => {
    food.originPrice = Number(food.originPrice)
    await API.POST('/api/foods', { data: food })
}

async function loadFood(_food: Ref<Food>, _specs: Ref<Spec[]>) {
    const { id, name, desc, detail, imgUrl, originPrice, specs } = await API.GET(`/api/foods/${route.params.id}`)
    _specs.value = specs.map((spec: Spec) => {
        spec.price = toNumber(spec.price)
        return spec
    })
    Object.assign(_food, { id, name, desc, detail, imgUrl, originPrice: toNumber(originPrice) })
}

onMounted(async() => {
    console.log(isUpdatePage.value)
    if (isUpdatePage.value) {
        await loadFood(food, specs)
    }
})
</script>

<style lang='postcss' scoped>
    
</style>
