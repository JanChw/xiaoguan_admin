import imageCompression from 'browser-image-compression'

const url = '/api/files/uploads/test'

const STATIC_SERVER = 'http://127.0.0.1:8080'
const compressImageOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    fileType: 'image/webp',
    initialQuality: 0.75
}

export const editorOption = {
    language:'zh_CN',
    selector: 'textarea#file-picker',
    plugins: 'lists link image table code help wordcount fullscreen preview emoticons insertdatetime searchreplace',
    toolbar: ' undo redo searchreplace | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist insertdatetime | emoticons link image | fullscreen preview code',
    fullscreen_native: true,
    image_title: true,
    branding: false,
    // menubar:false,
    // toolbar_sticky: true,
    automatic_uploads: true,
    file_picker_types: 'image',
    file_picker_callback: function(cb, value, meta) {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        const formData = new FormData()
        input.onchange = async function() {
            const [file] = input.files
            const [filename] = file.name.split('.')
            const compressFile = await imageCompression(file, compressImageOptions)
            formData.append('file', compressFile, `${filename}.webp`)

            const response = await fetch(url, {
                method: 'POST',
                body: formData
            })
            if (response.status == 200 || response.status == 201) {
                formData.delete('file')
            }
            
            const result = await response.json()
            const [image] = result.data
            console.log(value, meta)
            cb(`${STATIC_SERVER}${image.url}`, { title: image.filename })
        }

        input.click()
    }
    // init_instance_callback: function(editor) {
    //     console.log(editor.id)
    // }


}
