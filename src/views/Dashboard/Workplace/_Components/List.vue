<template>
    <a-list type='card' :data='list'>
        <template #header>
            <div class='card-header flex justify-between items-center'>
                <span>进行中的项目</span>
                <el-link type='primary' :underline='false' href='javascript:;'>全部项目</el-link>
            </div>
        </template>
    </a-list>

    <el-card shadow='hover' class='mb-2'>
        <template #header>
            <div class='card-header flex justify-between items-center'>
                <span>动态</span>
            </div>
        </template>
        <a-list :data='list'>
            <template #default='scope'>
                <el-button @click='edit(scope.item)'>操作</el-button>
            </template>
        </a-list>
    </el-card>
</template>
// TODO:此次List为何不被引入
<script lang='ts' setup>
import AList from '/@/components/List/index.vue'
import { IList } from '/@/type/components/index.interface'

// list初始化
const list:IList[] = [
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前',
        href: 'javascript:;'
    },
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前'
    },
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前'
    },
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前'
    },
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前'
    },
    { 
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        title: '支付宝',
        subTitle: '斗通关无际县军连用知政以该果思快领c。',
        tag: '科学搬砖组',
        time: '9小时前'
    }
]
const edit = (item:IList) => console.log(item)

</script>