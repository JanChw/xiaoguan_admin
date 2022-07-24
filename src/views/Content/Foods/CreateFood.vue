<template>
    <h1>添加菜品</h1>
    <Editor ref='editorRef' />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Editor from '/@/components/Editor/Index.vue'
const editorRef = ref()
    
</script>