<template>

    <div class='w-full h-full overflow-x-hidden'>
        <el-tabs v-model='currentPane'>
            <el-tab-pane label='本地上传' name='local' class='flex justify-center mt-10'>
                <el-upload
                    ref='uploadRef'
                    :auto-upload='false'
                    :on-change='addFile'
                    :on-remove='removeFile'
                    multiple
                    class='border-2 border-gray-500 border-dotted rouned w-8/12 p-10 text-center local'
                >
                    <template #trigger>
                        <el-button type='primary'>select file</el-button>
                    </template>

                    <el-button class='ml-3' type='success' @click='onLocalUpload'>
                        upload to server
                    </el-button>

                    <template #tip>
                        <div class='el-upload__tip'>
                            jpg/png files with a size less than 500kb
                        </div>
                    </template>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label='网络上传' name='remote' class='flex justify-center mt-20'>
                <div class=' w-full flex justify-center'>
                    <el-form :inline='true' :model='form' class='w-full flex justify-center'>
                        <el-form-item class='w-1/3'>
                            <el-input v-model='form.url' placeholder='填写上传图片网址' class='w-1/2' />
                        </el-form-item>
                        <el-form-item>
                            <el-button type='primary' @click='onRemoteUpload(form.url)'>上传</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    
</template>
// TODO:封装上传文件
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useUploadFiles } from '/@/common/useUploadFiles'
const { uploadRef, addFile, removeFile, onLocalUpload, onRemoteUpload } = useUploadFiles()

const currentPane = ref('local')
const form = reactive({ url: '' })
</script>

<style lang='postcss' scoped>
    .local {
        height: 33.333vh;
    }
</style>
