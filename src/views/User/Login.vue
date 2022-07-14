<template>
    <div class='w-screen h-screen'>
        <div class='layout-login flex-1' @keyup='enterSubmit'>
            <h3 class='text-2xl font-semibold text-gray-300 text-center mb-8'>系统登陆</h3>
            <el-form ref='ruleForm' label-position='right' label-width='80px' :model='form' :rules='rules'>
                <el-form-item class='' prop='name'>
                    <el-input v-model='form.name' placeholder='请输入用户名' size='large' prefix-icon='el-icon-user' />
                </el-form-item>
                <el-form-item class='' prop='pwd'>
                    <el-input v-model='form.pwd' placeholder='请输入密码' size='large' prefix-icon='el-icon-lock' show-password />
                </el-form-item>
                <div>
                    <el-button type='primary' size='large' class='w-full h-47' @click='onSubmit'>登录</el-button>
                </div>
                
                
                <div class='flex justify-end'>
                    <el-checkbox label='记住我' size='large' />
                </div>

            </el-form>
        </div>
        
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useLayoutStore } from '/@/store/modules/layout'
import { ElNotification } from 'element-plus'
import { validate } from '/@/utils/formExtend'

const formRender = () => {
    const { login } = useLayoutStore()
    let form = reactive({
        name: 'admin',
        pwd: 'admin'
    })
    const ruleForm = ref(null)
    const enterSubmit = (e:KeyboardEvent) => {
        if(e.key === 'Enter') {
            onSubmit()
        }
    }
    const onSubmit = async() => {
        let { name, pwd } = form
        if(!await validate(ruleForm)) return
        await login({ username: name, password: pwd })
        ElNotification({
            title: '欢迎',
            message: '欢迎回来',
            type: 'success'
        })
    }
    const rules = reactive({
        name: [
            { validator: (rule: any, value: any, callback: (arg0?: Error|undefined) => void) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'))
                }
                callback()
            }, trigger: 'blur' 
            }
        ],
        pwd: [
            { validator: (rule: any, value: any, callback: (arg0?: Error|undefined) => void) => {
                if (!value) {
                    return callback(new Error('密码不能为空'))
                }
                callback()
            }, trigger: 'blur' 
            }
        ]
    })
    return {
        form, 
        onSubmit,
        enterSubmit,
        rules,
        ruleForm
    }
}
export default defineComponent({
    name: 'Login',
    setup() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            ...formRender()
        }
    }
})
</script>

<style lang='postcss' scoped>
.layout-login {
    padding-top: 200px;
    width: 500px;
    margin: 0 auto;

    ::v-deep(.el-input__inner) {
        border: 2px solid hsla(0, 0%, 100%, 0.1);
        border-radius: 5px;
       
    }
    ::v-deep(.el-input__inner), ::v-deep(.el-button--large) {
         height:47px;
         font-size: 15px;
    }

    ::v-deep(.el-form-item__content) {
        margin-left: 0!important;
        margin-bottom: 30px;
    }
    ::v-deep(.el-form-item__content:hover) {
         box-shadow: 2px 3px 4px lightgray;
         
    }
    ::v-deep(.el-icon) {
        color: black;
        font-size: 21px!important;
    }

    ::v-deep(.el-form-item__error) {
        margin: 7px;
        font-size: 14px;
    }

    ::v-deep(.el-button:hover) {
        box-shadow: 2px 3px 4px var(--el-color-primary);
        background-color: var(--el-color-primary);
    } 
}

</style>