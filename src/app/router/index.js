import { createRouter, createWebHistory } from 'vue-router'

// Vistas


import RegisterPage from "@/modules/auth/pages/register-page.vue";
import LoginPage from "@/modules/auth/pages/login-page.vue";
import RecoverPasswordPage from "@/modules/auth/pages/recover-password.page.vue";

const routes = [
/*
    {
        path: '/manager/:id',
        component: ManagerLayout,
        children: [
            ]},
        {
        path: '/student/:id',
        component: StudentLayout,
        children: []


    },

*/






    { path: '/',
        redirect: '/register'
    },


    { path: '/register',
        name: 'register',
        component: RegisterPage,
        meta: { title: 'Register' }


    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { title: 'Login' }
    },
    {
        path: '/recover-password',
        name: 'recover-password',
        component: RecoverPasswordPage,
        meta: { title: 'Recover Password' }
    }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router