import imageCompression from 'browser-image-compression'
import { compressOptions } from '/@/config/index'

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
            const result = await response.json()
            if (!response.ok) { throw new Error(result.message) }
            return result.data
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('请求中断或超时')
            } else {
                console.log(error.message)
            }
        } 
    }

    static GET = Http.Fetch('GET')

    static POST = Http.Fetch('POST')

    static PUT = Http.Fetch('PUT')

    static DELETE = Http.Fetch('DELETE')

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