import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/Register.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/Home.vue'),
            meta: { requiresAuth: true }
        }
    ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
    const isLoggedIn = sessionStorage.getItem('userInfo')

    if (to.meta.requiresAuth && !isLoggedIn) {
        // 需要登录但未登录，重定向到登录页
        next({ name: 'login' })
    } else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
        // 已登录但访问登录或注册页，重定向到首页
        next({ name: 'home' })
    } else {
        next()
    }
})
export default router