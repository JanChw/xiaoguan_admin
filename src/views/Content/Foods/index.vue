<template>
    <div>
        <router-view />
    </div>
</template>
<script lang="ts" setup>
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000/message', { withCredentials: true })
socket.emit('save', JSON.stringify({ message: 'hello world' }))
</script>