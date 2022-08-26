<template>
    <el-table :data='orders' style='width: 100%'>
        <el-table-column label='日期'>
            <template #default='scope'><span>{{ new Date(scope.row.createdAt).toLocaleDateString() }}</span></template>
        </el-table-column>
        <el-table-column label='订单编号' prop='code' />
        <el-table-column label='订单状态' prop='status' />
        <el-table-column label='订单商品数量' prop='totalQty' />
        <el-table-column label='订单商品总价' prop='totalPrice' />
        <el-table-column label='用户Id' prop='userId' />
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
                <router-link to=''>
                    <el-button
                        size='small'
                    >用户详情</el-button>
                </router-link>
                <router-link to=''>
                    <el-button
                        size='small'
                    >订单详情</el-button>
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
import { Order } from '/@/type/models/order.interface'

let orders = ref<Order[]>([])
const search = ref<string>('')

const handleSearch = async(search: string) => {
    console.log(search)
    const data = await Http.get(`/api/orders/search?content=${search}`)
    orders.value = data
}



onMounted(async() => {

    await loadOrders(orders)
})

async function loadOrders(orders: Ref<Order[]>) {
    const data = await Http.get('/api/orders')
    console.log(data)
    orders.value = data
    console.log(orders)
}



</script>
