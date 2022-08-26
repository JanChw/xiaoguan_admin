import { ref, watch } from 'vue'
import type { UploadInstance, UploadFiles, UploadFile } from 'element-plus'
import Http from '/@/api/http'
const { MY_STATIC_SERVER } = import.meta.env

export const useUploadFiles = () => {
  const uploadRef = ref<UploadInstance>()

  let _uploadFiles: UploadFiles = []
  
  watch(uploadRef, () => {
    console.log(uploadRef)
  })
  const addFiles = async(uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    _uploadFiles = uploadFiles
  }

  const removeFile = addFiles

  const handleRemove = async(deleted: UploadFile) => {
    uploadRef.value?.handleRemove(deleted)
    console.log(_uploadFiles.length)
    _uploadFiles = _uploadFiles.filter(file => file.uid !== deleted.uid)
    console.log(_uploadFiles.length)
    
  }

  const onRemoteUpload = async(url: string, tip = true) => {
    const data = await Http.uploadRemoteImage('test', url, tip)
    return data
  }
  const onLocalUpload = async(tip = true) => {
    const uploadRawFiles = _uploadFiles.map(uploadFile => uploadFile.raw)
    const data = await Http.uploadImages('test', uploadRawFiles, tip)
    console.log(data)
    uploadRef.value?.clearFiles()
    return data.map(({ id, filename, originName, url }) => ({
      id,
      filename,
      originName,
      url: `${MY_STATIC_SERVER}${url}`
    }))
        
  }

  return { uploadRef, onRemoteUpload, onLocalUpload, addFiles, removeFile, handleRemove }

}

