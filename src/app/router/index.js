import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import ManagerLayout from '@/shared/layouts/manager-layout.component.vue'
import StudentLayout from '@/shared/layouts/student-layout.component.vue'

// Auth
import RegisterPage from "@/modules/auth/pages/register-page.vue"
import LoginPage from "@/modules/auth/pages/login-page.vue"
import RecoverPasswordPage from "@/modules/auth/pages/recover-password.page.vue"

// Manager views
import CallsPage from "@/modules/companies/pages/manager-calls.page.vue"
import ProjectPostulationsPage from "@/modules/companies/pages/project-postulations.page.vue"
import ReputationViewPage from "@/modules/companies/pages/reputation-view.page.vue"
import MyCompanyPage from "@/modules/companies/pages/my-company.page.vue"
import EditCompanyPage from "@/modules/companies/pages/edit-company.page.vue"


// Student views
import StudentOpportunitiesPage from "@/modules/projects/pages/student-opportunities.page.vue"
import MyProfilePage from "@/modules/students/pages/my-profile.page.vue";

const ManagerProjectsPage = () => import('@/modules/projects/pages/manager-project.page.vue')
const ProjectDetailPage = () => import('@/modules/projects/pages/project-detail.page.vue')


// Error
// import NotFoundPage from "@/modules/public/pages/not-found-page.vue"

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterPage
    },
    {
        path: '/recover-password',
        name: 'recover-password',
        component: RecoverPasswordPage
    },

    // Rutas para manager
    {
        path: '/manager',
        component: ManagerLayout,
        children: [
            {
                path: 'projects',
                name: 'ManagerProjects',
                component: ManagerProjectsPage,
                meta: { title: 'Mis Proyectos' }
            },
            {
                path: 'projects/new',
                name: 'ManagerNewProject',
                component: ProjectDetailPage,
                meta: { title: 'Nuevo Proyecto' }
            },
            {
                path: 'projects/:id',
                name: 'ManagerProjectDetail',
                component: ProjectDetailPage,
                props: true,
                meta: { title: 'Detalle de Proyecto' }
            },
            {
                path: 'calls',
                name: 'ManagerCalls',
                component: CallsPage
            },
            {
                path: 'calls/:id',
                name: 'ManagerProjectPostulations',
                component: ProjectPostulationsPage,
                props: true
            },
            {
                path: 'reputation/:studentId',
                name: 'ManagerStudentReputation',
                component: ReputationViewPage,
                props: route => ({
                    studentId: parseInt(route.params.studentId),
                    projectId: parseInt(route.query.projectId)
                })
            },
            {
                path: 'company',
                name: 'ManagerCompany',
                component: MyCompanyPage
            },
            {
                path: 'company/edit',
                name: 'EditCompany',
                component: EditCompanyPage
            }
        ]
    },

    // Rutas para estudiantes
    {
        path: '/student',
        component: StudentLayout,
        children: [
            {
                path: 'opportunities',
                name: 'StudentOpportunities',
                component: StudentOpportunitiesPage
            },
            // Luego agregaremos aquí Portafolio, Postulaciones, Perfil, etc.
            {
                path: 'profile',
                name: 'StudentProfile',
                component: MyProfilePage
            },
            {
                path: 'profile/edit',
                name: 'EditProfile',
                
            }
        ]
    },

    // Página 404 (descomentaremos después)
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'not-found',
    //     component: NotFoundPage
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title || 'Gestión de Proyectos'
    document.title = `${title} | TuAplicación`
    next()
})

export default router
