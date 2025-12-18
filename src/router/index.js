import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import LogUploader from '../views/LogUploader.vue'
import Encounter from '../views/Encounter.vue'
import EncounterOverview from '../views/EncounterOverview.vue'
import EncounterDamage from '../views/EncounterDamage.vue'
import EncounterHealing from '../views/EncounterHealing.vue'
import EncounterDeaths from '../views/EncounterDeaths.vue'
import Log from '../views/Log.vue'
import Registration from '../views/Registration.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { requiresUnAuth: true, title: 'Login' } },
  { path: '/register', name: 'register', component: Registration, meta: { requiresUnAuth: true, title: 'Registration' } },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, title: 'Dashboard' } },
  { path: '/log-upload', name: 'log-upload', component: LogUploader, meta: { requiresAuth: true, title: 'Log Upload' } },
  {
    path: '/log/:logId', name: 'log', component: Log, meta: { requiresAuth: true, title: 'Log' }, children:
      [
        {
          path: 'encounter/:encounterId',
          component: Encounter,
          props: true,
          meta: { requiresAuth: true, title: 'Encounter' },
          children: [
            {
              path: '',
              name: 'encounter',
              component: EncounterOverview,
              meta: { title: 'Encounter Overview' }
            },
            {
              path: 'damage',
              name: 'encounter-damage',
              component: EncounterDamage,
              meta: { title: 'Damage Analysis' }
            },
            {
              path: 'healing',
              name: 'encounter-healing',
              component: EncounterHealing,
              meta: { title: 'Healing Analysis' }
            },
            {
              path: 'deaths',
              name: 'encounter-deaths',
              component: EncounterDeaths,
              meta: { title: 'Deaths' }
            }
          ]
        }
      ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to the top of the page on navigation
    return { top: 0, left: 0 };
  }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Wait until /me finishes on page load
  if (!auth.isLoaded) {
    await auth.loadUser();
  }

  if (
    to.meta.requiresAuth &&
    !auth.isAuthenticated
  ) {
    return { name: 'login' }
  }

  if (auth.isAuthenticated && to.meta.requiresUnAuth) {
    return { name: 'dashboard' }
  }

  if (to.meta.title) {
    document.title = to.meta.title + ' - Wow Log Analyzer';
  } else {
    document.title = 'Wow Log Analyzer';
  }
})

export default router