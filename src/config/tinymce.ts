import API from '/@/api'
import { STATIC_SERVER } from './index'

export const mykey = 'ywp9pdfho4awyfp9eq34q4k2fhlj7ks895dwo2fqguxaxa78'

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
        input.onchange = async function() {

            const [image] = await API.uploadImages('test', Array.from(input.files))
            console.log(value, meta)
            cb(`${STATIC_SERVER}${image.url}`, { title: image.filename })
        }

        input.click()
    }
    // init_instance_callback: function(editor) {
    //     console.log(editor.id)
    // }


}

