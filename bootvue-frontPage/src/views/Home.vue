<template>
    <div class="home-container">
        <el-card class="welcome-card">
            <template #header>
                <div class="card-header">
                    <h3>欢迎使用</h3>
                    <el-button type="danger" @click="handleLogout">退出登录</el-button>
                </div>
            </template>
            <div class="user-info" v-if="userInfo">
                <p><strong>用户名：</strong>{{ userInfo.username }}</p>
                <p><strong>昵称：</strong>{{ userInfo.nickname }}</p>
                <p><strong>邮箱：</strong>{{ userInfo.email }}</p>
                <p><strong>手机号：</strong>{{ userInfo.phone }}</p>
                <p><strong>注册时间：</strong>{{ userInfo.createTime }}</p>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const userInfo = ref(null)
// 获取用户信息
onMounted(() => {
    const userInfoStr = sessionStorage.getItem('userInfo')
    if (userInfoStr) {
        // 将数据转换为 JavaScript 对象
        userInfo.value = JSON.parse(userInfoStr)
    } else {
        router.push('/login')
    }
})
// 退出登录
const handleLogout = () => {

    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 清除用户信息
        sessionStorage.removeItem('userInfo')

        // 提示退出成功
        ElMessage.success('退出登录成功')

        // 跳转到登录页
        router.push('/login')
    }).catch(() => { })
}
</script>
<style scoped>
.home-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.welcome-card {
    margin-top: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    line-height: 2;
}
</style>