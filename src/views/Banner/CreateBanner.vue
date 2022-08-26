<template>
    <div class='banner flex justify-center mt-20'>
        <el-form
            ref='bannerRef'
            :model='banner'
            :rules='rules'
            label-width='120px'
            :size='formSize'
            status-icon
        >
            <el-form-item label='名称' prop='name'>
                <el-input v-model='banner.name' />
            </el-form-item>
            <el-form-item label='标题' prop='title'>
                <el-input v-model='banner.title' />
            </el-form-item>
            <el-form-item label='简述' prop='desc'>
                <el-input v-model='banner.desc' type='textarea' />
            </el-form-item>
            <el-form-item>
                <el-row>
                    <el-tag v-for='(val, name, index) in banner.links' :key='index' size='large' closable @close='removeLink(name)'>
                        <el-tooltip :content='val'>
                            {{ name }}
                        </el-tooltip>
                    </el-tag>
                </el-row>
            </el-form-item>
            <el-form-item label='链接'>
                <el-row>
                    <div class='mt-10 mb-10'>
                        <el-input v-model='link.name' placeholder='链接名称' class='mb-3' />
                        <el-input v-model='link.value' placeholder='链接值' class='mb-3' />
                        <el-button class='w-full' @click='addLink(link)'>添加链接</el-button>
                    
                    </div>
                </el-row>
            </el-form-item>
            <el-form-item label='图片' class='flex justify-center text-center'>
                <div>
                    <el-upload
                        ref='uploadRef'
                        multiple
                        list-type='picture-card'
                        :limit='6'
                        :on-change='addFiles'
                        :auto-upload='false'
                    >
                        <el-icon><el-icon-plus /></el-icon>
                        <template #file='{ file }'>
                            <div>
                                <img class='el-upload-list__item-thumbnail' :src='file.url' alt=''>
                                <span class='el-upload-list__item-actions'>
                                    <span
                                        class='el-upload-list__item-delete'
                                        @click='handleRemove(file)'
                                    >
                                        <el-icon><el-icon-delete /></el-icon>
                                    </span>
                                </span>
                            </div>
                        </template>
                        <template #tip>
                            <div class='el-upload__tip text-red'>
                                仅限上传六张图片
                            </div>
                        </template>
                    </el-upload>
                </div>
            </el-form-item>
            <el-form-item class='btns'>
                <el-button
                    type='primary'
                    size='large'
                    @click='submitForm(bannerRef)'
                >创建</el-button>
                <el-button size='large' @click='resetForm(bannerRef)'>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUploadFiles } from '/@/common/useUploadFiles'
import Http from '/@/api/http'
import { Banner, initBanner } from './index'

const { uploadRef, addFiles, handleRemove, onLocalUpload } = useUploadFiles()
interface Link {
  name: string, value: string
}

// interface Banner {
//   id?: number,
//   name: string,
//   title: string,
//   desc: string,
//   links: any,
//   imgs: number[],
//   updatedAt?: Date | string
// }

const formSize = ref('default')
const bannerRef = ref<FormInstance>()
// const initBanner = () => ({
//   name: '',
//   title: '',
//   desc: '',
//   links: {},
//   imgs: []
// })
const banner = reactive<Banner>(initBanner())

const link = reactive<Link>({
  name:'',
  value: ''
})


const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入广告栏名称', trigger: 'blur' },
    { min: 2, max: 20, message: '名称应大于2小于10', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入广告栏标题', trigger: 'blur' },
    { min: 2, max: 20, message: '标题名称应大于2小于20', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入广告栏简述', trigger: 'blur' }
  ]
})

const addLink = (link: Link) => {
  let _link = {}
  _link[link.name] = link.value
  Object.assign(banner.links, _link)
  Object.assign(link, { name: '', value: '' })
}

const removeLink = (linkName: string) => {
  delete banner.links[linkName]
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  console.log(formEl)
  formEl.resetFields()
  Object.assign(banner, initBanner())
  uploadRef.value?.clearFiles()
}

const submitForm = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      await createBanner()
      resetForm(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const createBanner = async() => {
  const data = await onLocalUpload(false)

  banner.imgs = data.map(img => img.id)

  await Http.post('/api/banner', { data: banner })
}


</script>
<style lang='postcss' scoped>

  ::v-deep(.el-upload-list--picture-card .el-upload-list__item),
  ::v-deep(.el-upload--picture-card) {
    height: 90px!important;
    width: 90px!important;
  }

  ::v-deep(.btns.el-form-item .el-form-item__content) {
    display: flex;
    justify-content: center;
    margin: 1.5rem;
  }

</style>
