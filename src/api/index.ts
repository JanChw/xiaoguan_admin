import imageCompression from 'browser-image-compression'
import { compressOptions } from '/@/config/index'

interface FetchOption {
    data?: any;
    headers?: Partial<Headers>
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
// TODO:添加query的情况和超时处理
class API {

    static CompressOptions = compressOptions
    
    static Fetch = (method: Method) => async(url: string, options?: FetchOption) => {
        
        const opts = { method, headers: { 'Content-Type': 'application/json' } }

        if (options) {
            const { data, headers } = options

            if(headers) { 
                Object.assign(opts.headers, headers)
            }

            if (data) {
                Object.assign(opts, { body: JSON.stringify(data) })
            }
        }

        const response = await fetch(url, opts)
        const result = await response.json()
        if (![200, 201].includes(response.status)) { throw new Error(result.message) }
        return result.data
    }

    static GET = API.Fetch('GET')

    static POST = API.Fetch('POST')

    static PUT = API.Fetch('PUT')

    static DELETE = API.Fetch('DELETE')

    static GetUploadFilesUrl = (bucketname: string) => {
        return `/api/files/uploads/${bucketname}`
    }

    // 上传图片不用设置content-type
    static async uploadImages(bucketname: string, rawFiles: File[]) {
        const formData = new FormData()
        console.log(rawFiles)
        const compressFilePromises = rawFiles.map(rawFile => imageCompression(rawFile, API.CompressOptions))
        const uploadCompressFiles = await Promise.all(compressFilePromises)
        uploadCompressFiles.forEach(file => {
            const [filename] = file.name.split('.')
            formData.append('file', file, `${filename}.webp`)
        })
        const response = await fetch(API.GetUploadFilesUrl(bucketname), {
            method: 'POST',
            body: formData
        })

        const { data, message } = await response.json()
        if (![200, 201].includes(response.status)) {
            throw new Error(message)
        }
        return data
    }

}



export default API