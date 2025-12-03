import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import LogUploader from '../views/LogUploader.vue'
import Encounter from '../views/Encounter.vue'
import Log from '../views/Log.vue'
import Registration from '../views/Registration.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { requiresUnAuth: true, title: 'Login' }  },
  { path: '/register', name: 'register', component: Registration, meta: { requiresUnAuth: true, title: 'Registration' }  },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, title: 'Dashboard' } },
  { path: '/log-upload', name: 'log-upload', component: LogUploader, meta: { requiresAuth: true, title: 'Log Upload' } },
  { path: '/log/:logId', name: 'log', component: Log, meta: { requiresAuth: true, title: 'Log' }, children: 
    [
      {
        path: 'encounter/:encounterId',
        name: 'encounter',
        component: Encounter,
        props: true,
        meta: { requiresAuth: true, title: 'Encounter Overview' }
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
  if (
    to.meta.requiresAuth && 
    !auth.isAuthenticated
  ) {
    return { name: 'login' }
  }

  if (auth.isAuthenticated && to.meta.requiresUnAuth) {
    return { name: 'dashboard'}
  }

  if (to.meta.title) {
    document.title = to.meta.title + ' - Wow Log Analyzer';
  } else {
    document.title = 'Wow Log Analyzer';
  }
})

export default router