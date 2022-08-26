<template>
    <el-table :data='users' style='width: 100%'>
        <el-table-column label='日期'>
            <template #default='scope'><span>{{ new Date(scope.row.createdAt).toLocaleDateString() }}</span></template>
        </el-table-column>
        <el-table-column label='昵称' prop='name' />
        <el-table-column label='电话' prop='phone' />
        <el-table-column label='地址' prop='addresses'>
            <template #default='scope'>
                <div v-for='address in scope.row.addresses' :key='address.id'>
                    <span v-if='address.isDefault'>
                        {{ address.address }}
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column fixed='right'>
            <template #header>
                <el-input
                    v-model.trim='search'
                    size='large'
                    placeholder='Type to search'
                    @keyup.enter='handleSearch(search)'
                >
                    <template #append>
                        <el-button :icon='Search' @click='handleSearch(search)' />
                    </template>
                </el-input>
            </template>
            <template #default='scope'>
                <router-link :to='{name: "showUser", params: { id: scope.row.id }}'>
                    <el-button
                        size='small'
                    >用户详情</el-button>
                </router-link>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from 'vue'

import Http from '/@/api/http'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import { User } from '/@/type/models/user.interface'

let users = ref<User[]>([])
const search = ref<string>('')

const handleSearch = async(search: string) => {
    console.log(search)
    const _users = await Http.get(`/api/users/search?content=${search}`)
    users.value = _users
}



onMounted(async() => {

    await loadUsers(users)
})

async function loadUsers(users: Ref<User[]>) {
    const data = await Http.get('/api/users')
    console.log(data)
    users.value = data
    console.log(users)
}



</script>
