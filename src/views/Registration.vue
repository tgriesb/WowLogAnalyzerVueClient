<template>
  <div class="register-page">
    <h2>Registration</h2>

    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model.trim="username"
          type="text"
          placeholder="Enter username"
        />
        <span v-if="errors.username" class="error">{{ errors.username }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          placeholder="Enter email"
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model.trim="password"
          type="password"
          placeholder="Enter password"
        />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model.trim="confirmPassword"
          type="password"
          placeholder="Re-enter password"
        />
        <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
      </div>

      <button type="submit" class="register-btn" :disabled="submitting">
        {{ submitting ? 'Creating Account...' : 'Register' }}
      </button>

      <p class="login-link">
        Already have an account?
        <RouterLink to="/login">Login here</RouterLink>.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

const router = useRouter()
const { request } = useApi()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const submitting = ref(false)

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function validate() {
  errors.value = { username: '', email: '', password: '', confirmPassword: '' }
  let isValid = true

  if (!username.value) {
    errors.value.username = 'Username is required'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true

  try {
    const res = await request('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    })

    alert('Account created successfully!')
    router.push('/login')
  } catch (err) {
    console.error(err)
    alert('Registration failed. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.register-page {
  background: #181818;
  color: #f1f1f1;
  padding: 2rem;
  border-radius: 10px;
  max-width: 420px;
  margin: 3rem auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #fff;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #ccc;
}

input {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 0.6rem;
  color: #f1f1f1;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.register-btn {
  background: #3b82f6;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.register-btn:hover {
  background: #2563eb;
}

.register-btn:disabled {
  background: #555;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #aaa;
}

.login-link a {
  color: #3b82f6;
  text-decoration: none;
}
.login-link a:hover {
  text-decoration: underline;
}
</style>
