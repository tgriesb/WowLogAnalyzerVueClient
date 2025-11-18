<template>
  <div id="app">
    <header class="navbar">
      <nav class="nav-container">
        <!-- Left side -->
        <div class="nav-left">
          <RouterLink to="/">My Logs</RouterLink>
          <RouterLink to="/log-upload">Upload</RouterLink>
        </div>

        <!-- Right side -->
        <div class="nav-right">
          <template v-if="isAuthenticated">
            <span class="user-email">{{ user.email }}</span>
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login">Login</RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>


<script setup>
import { RouterView, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from './store/auth'
import { ref } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const user = auth.user
const isAuthenticated = auth.isAuthenticated


const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* 🌙 Sticky Dark Navbar */
.navbar {
  position: sticky;         /* 👈 Keeps it at top while scrolling */
  top: 0;
  z-index: 1000;            /* Stay above other content */
  background-color: #121212;
  border-bottom: 1px solid #2a2a2a;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Navigation links */
a {
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

a:hover {
  color: #3b82f6;
}

a.router-link-active {
  color: #3b82f6;
}

/* Right side user info */
.user-email {
  color: #aaa;
  margin-right: 1rem;
  font-size: 0.9rem;
}

.logout-btn {
  background-color: transparent;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.logout-btn:hover {
  background-color: #3b82f6;
  color: #fff;
}

.main-content {
  background-color: #181818;
  min-height: 100vh;
  padding: 5rem 2rem 2rem; /* 👈 Add top padding to avoid overlap with sticky header */
  color: #f1f1f1;
}
</style>