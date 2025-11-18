
<template>
  <div class="center">
    <div class="card" style="max-width: 400px; width: 100%;">
      <h1 class="text-center">Welcome Back</h1>

      <form @submit.prevent="login">
        <div style="margin-bottom: 1rem;">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>

        <div style="margin-bottom: 1rem;">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>

        <button class="button" type="submit">Sign In</button>
      </form>

      <p class="small-text text-center" style="margin-top: 1.5rem;">
        Don’t have an account?
        <RouterLink to="/register">Register</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '../store/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  const success = await auth.login(email.value, password.value)
  if (success) {
    router.push('/')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>