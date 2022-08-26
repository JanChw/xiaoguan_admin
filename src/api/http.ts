import imageCompression from 'browser-image-compression'
import { compressOptions } from '/@/config/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const { MY_BASE_URL } = import.meta.env


export interface FetchOption {
    data?: any;
    headers?: Partial<Headers>;
    // urlOpts?: UrlOption;
    params?: any,
    query?: any
}


type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

class Http {

    
  static CompressOptions = compressOptions
    
  static Fetch = (method: Method) => async(url: string, options?: FetchOption, timeout = 3000) => {
    url = `${MY_BASE_URL}${url}`
    const opts = { mode: 'cors', method, headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(timeout) }

    if (options) {
      const { data, headers, params, query } = options

      headers && Object.assign(opts.headers, headers)
            
      data && Object.assign(opts, { body: JSON.stringify(data) })

      params && (url = parseNamedParams(url, params))

      query && (function() {
        const _url = new URL(url)
        const urlparams = _url.searchParams
        Object.entries(query).forEach(item => {
          urlparams.append(...item)
        })
        url = _url.href
      })()
            
    }
    console.log(url)
    try {
      const response = await fetch(url, opts)
      const { data, message } = await response.json()
      if (!response.ok) { throw new Error(message) }
      if(data == null || (Array.isArray(data) && !data.length)) {
        ElMessage({ type: 'warning',message: '数据为空' })
      }
      return data
    } catch (error) {
      const errMsg = error.name === 'AbortError' ? '请求中断或超时' : error.message
      ElMessage({ type: 'error',message: errMsg })
    } 
  }

  static get = Http.Fetch('GET')

  static post = Http.Fetch('POST')

  static put = Http.Fetch('PUT')

  static delete = Http.Fetch('DELETE')

  static deleteWithMessageBox = async function(url: string, options?: FetchOption): Promise<[any, boolean]> {

    const result = await ElMessageBox.confirm('确认删除文件？','警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(() => {
      ElMessage({ type: 'info', message: '取消删除' })
    })

    if (result === 'confirm') {
      const data = await Http.delete(url, options)
      ElMessage({ type: 'success', message: '完成删除' })
      return [data, false]
    }

    return [null, true]

  }

  static getUploadFilesUrl = (bucketname: string) => {
    return `/api/files/upload/${bucketname}`
  }

  static getUploadRemoteFileUrl = (bucketname: string) => {
    return `/api/file/upload/${bucketname}/remote`
  }

  // 上传图片不用设置content-type
  static async uploadImages(bucketname: string, rawFiles: File[], tip = false) {

    try {
      const formData = new FormData()
      if (!rawFiles.length) throw new Error('未选择上传文件')
      const compressFilePromises = rawFiles.map(rawFile => imageCompression(rawFile, Http.CompressOptions))
      const uploadCompressFiles = await Promise.all(compressFilePromises)
      uploadCompressFiles.forEach(file => {
        const [filename] = file.name.split('.')
        formData.append('file', file, `${filename}.webp`)
      })

      const response = await fetch(Http.getUploadFilesUrl(bucketname), {
        method: 'POST',
        body: formData
      })

      const { data, message } = await response.json()
      if (![200, 201].includes(response.status)) {
        throw new Error(message)
      }
      if (tip) ElMessage({ type: 'success', message: '图片完成上传' })
      console.log(data)
      return data
    } catch (error) {
      console.log(error.message)
      if (tip) ElMessage({ type: 'error', message: error.message })
    }
  }

  static async uploadRemoteImage(bucketname: string, url: string, tip = false) {
    const data = await Http.post(Http.getUploadRemoteFileUrl(bucketname), { data: { url } })
    if (tip && data) ElMessage({ type: 'success', message: '图片完成上传' })
  }

  static async removeFiles(bucketname: string, filenames: string[]) {
    const data = await Http.delete(`/api/files/${bucketname}`, { data: { filenames } })
    return data
  }
}

function parseNamedParams(url: string, params:any): string {
  const reg = /:([a-z]+)/gi
  return url.replace(reg, (_, ...args) => {
    const [key] = args
    return params[key]
  })
}

export default Http