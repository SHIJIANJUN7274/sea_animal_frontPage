<template>
    <div class="login-container">
        <div class="login-box">
            <h2 class="title">用户登录</h2>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
                    <el-button @click="$router.push('/register')">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../utils/api'
const router = useRouter()
const loading = ref(false)
// 登录表单数据
const loginForm = reactive({
    username: '',
    password: '',
})
// 表单验证规则
const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 20, message: '用户名长度在4-20个字符之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
    ],
}
// 登录表单引用
const loginFormRef = ref(null)
// 登录处理
const handleLogin = async () => {
    // 表单验证
    await loginFormRef.value.validate()
    try {
        loading.value = true
        // 调用登录接口
        const res = await login({ ...loginForm })
        // 存储用户信息
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        // 登录成功提示
        ElMessage.success('登录成功')
        // 跳转到首页
        router.push('/home')
    } catch (error) {
        console.error('登录失败:', error)
    } finally {
        loading.value = false
    }
}
</script>
<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-box {
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