<template>
    <div class="register-container">
        <div class="register-box">
            <h2 class="title">用户注册</h2>
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"
                        show-password></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="registerForm.nickname" placeholder="请输入昵称"></el-input>

                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>

                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="handleRegister">注册</el-button>
                    <el-button @click="$router.push('/login')">返回登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '../utils/api'
const router = useRouter()
const loading = ref(false)
// 注册表单数据
const registerForm = reactive({
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: ''
})
// 表单验证规则
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 20, message: '用户名长度在4-20个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
}
// 注册表单引用
const registerFormRef = ref(null)
// 注册处理
const handleRegister = async () => {
    // 表单验证
    await registerFormRef.value.validate()

    try {
        loading.value = true
        // 调用注册接口
        await register({ ...registerForm })

        // 注册成功提示
        ElMessage.success('注册成功，请登录')

        // 跳转到登录页
        router.push('/login')
    } catch (error) {
        console.error('注册失败:', error)
    } finally {
        loading.value = false
    }
}
</script>
<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.register-box {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    margin-bottom: 30px;
    color: #409eff;
}
</style>