import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import LogUploader from '../views/LogUploader.vue'
import Encounter from '../views/Encounter.vue'
import Log from '../views/Log.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/log-upload', name: 'log-upload', component: LogUploader, meta: { requiresAuth: true } },
  { path: '/log/:logId', name: 'log', component: Log, meta: { requiresAuth: true }, children: 
    [
      {
        path: 'encounter/:encounterId',
        name: 'encounter',
        component: Encounter,
        props: true,
        meta: { requiresAuth: true }
      }
    ]
   }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name == 'login' && auth.isAuthenticated) {
    return { name: 'dashboard'}
  }
})

export default router