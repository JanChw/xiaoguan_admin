<template>
    <tiny-editor
        id='editor'
        v-model='content'
        :api-key='keyRef'
        :init='editorOption'
    />
    <div v-show='isPreview' v-html='content' />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TinyEditor from '@tinymce/tinymce-vue'
import mykey from '/@/config/tinymce'
import { editorOption } from './Index'

const keyRef = ref<string>(mykey)
const content = ref<string>('')

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: false
    }
})

defineExpose({ content })
</script>

<style lang='postcss' scoped>
    #editor {
        display: none;
    }
</style>