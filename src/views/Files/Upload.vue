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
import type { UploadInstance, UploadFiles, UploadFile } from 'element-plus'
import imageCompression from 'browser-image-compression'

const url = '/api/files/uploads/test'

const uploadRef = ref<UploadInstance>()
let formData = new FormData()
let _uploadFiles: UploadFiles = []
const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    fileType: 'image/webp',
    initialQuality: 0.75
}


const addFile = async(uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    _uploadFiles = uploadFiles
}

const removeFile = async(uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    _uploadFiles = uploadFiles
}
const submitUpload = async() => {
    const uploadRawFiles = _uploadFiles.map(uploadFile => uploadFile.raw)
    const compressFilePromises = uploadRawFiles.map(rawFile => imageCompression(rawFile, options))
    const uploadCompressFiles = await Promise.all(compressFilePromises)
    uploadCompressFiles.forEach(file => {
        formData.append('file', file, `${file.name}.webp`)
    })

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    }).catch(err => console.log(err))

    if (response.status == 200 || response.status == 201) {
        formData.delete('file')
        uploadRef.value?.clearFiles()
    }
}
</script>
