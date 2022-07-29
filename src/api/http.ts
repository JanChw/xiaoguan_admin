import imageCompression from 'browser-image-compression'
import { compressOptions } from '/@/config/index'
import { ElMessage, ElMessageBox } from 'element-plus'

interface UrlOption {
    param?: number | string,
    query?: any
}

interface FetchOption {
    timeout?: number;
    data?: any;
    headers?: Partial<Headers>;
    urlOpts?: UrlOption;
}


type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

class Http {

    static BaseUrl = 'http://localhost:3002'

    static CompressOptions = compressOptions
    
    static Fetch = (method: Method) => async(url: string, options?: FetchOption, timeout = 3000) => {
        url = `${Http.BaseUrl}${url}`
        const opts = { method, headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(timeout) }

        if (options) {
            const { data, headers, urlOpts } = options

            headers && Object.assign(opts.headers, headers)
            
            data && Object.assign(opts, { body: JSON.stringify(data) })

            urlOpts?.param && (url += `/${urlOpts?.param}`)

            urlOpts?.query && (function() {
                const _url = new URL(url)
                const urlparams = _url.searchParams
                Object.entries(urlOpts?.query).forEach(item => {
                    urlparams.append(...item)
                })
                url = _url.href
            })()
            
        }

        try {
            const response = await fetch(url, opts)
            const { data, message } = await response.json()
            if (!response.ok) { throw new Error(message) }
            if(data == null || (Array.isArray(data) && !data.length)) {
                ElMessage({
                    type: 'warning',
                    message: '数据为空'
                })
            }
            return data
        } catch (error) {
            const errMsg = error.name === 'AbortError' ? '请求中断或超时' : error.message

            ElMessage({
                type: 'error',
                message: errMsg
            })
        } 
    }

    static get = Http.Fetch('GET')

    static post = Http.Fetch('POST')

    static put = Http.Fetch('PUT')

    static delete = Http.Fetch('DELETE')

    static deleteWithMessageBox = async function(url: string, options?: FetchOption): Promise<[any, boolean]> {
        const result = await ElMessageBox.confirm(
            '确认删除文件？',
            '警告',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除'
            })
        })
       
        if (result === 'confirm') {
            const data = await Http.DELETE(url, options)
            ElMessage({
                type: 'success',
                message: '完成删除'
            })
            return [data, false]
        }

        return [null, true]

    }

    static GetUploadFilesUrl = (bucketname: string) => {
        return `/Http/files/uploads/${bucketname}`
    }

    // 上传图片不用设置content-type
    static async uploadImages(bucketname: string, rawFiles: File[]) {
        const formData = new FormData()
        console.log(rawFiles)
        const compressFilePromises = rawFiles.map(rawFile => imageCompression(rawFile, Http.CompressOptions))
        const uploadCompressFiles = await Promise.all(compressFilePromises)
        uploadCompressFiles.forEach(file => {
            const [filename] = file.name.split('.')
            formData.append('file', file, `${filename}.webp`)
        })
        const response = await fetch(Http.GetUploadFilesUrl(bucketname), {
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




export default Http