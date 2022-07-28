<template>

    <div class='flex justify-center items-center w-full h-full overflow-x-hidden'>
        <el-upload
            ref='uploadRef'
            :auto-upload='false'
            :on-change='addFile'
            :on-remove='removeFile'
            multiple
            class='border-2 border-gray-500 border-dotted rouned w-8/12 h-3/6 p-10 text-center'
        >
            <template #trigger>
                <el-button type='primary'>select file</el-button>
            </template>

            <el-button class='ml-3' type='success' @click='submitUpload'>
                upload to server
            </el-button>

            <template #tip>
                <div class='el-upload__tip'>
                    jpg/png files with a size less than 500kb
                </div>
            </template>
        </el-upload>
    </div>
    
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import API from '/@/api'
import type { UploadInstance, UploadFiles, UploadFile } from 'element-plus'


const uploadRef = ref<UploadInstance>()

let _uploadFiles: UploadFiles = []


const addFile = async(uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    _uploadFiles = uploadFiles
}

const removeFile = async(uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    _uploadFiles = uploadFiles
}
const submitUpload = async() => {
    const uploadRawFiles = _uploadFiles.map(uploadFile => uploadFile.raw)
    await API.uploadImages('test', uploadRawFiles)
    uploadRef.value?.clearFiles()
}
</script>
