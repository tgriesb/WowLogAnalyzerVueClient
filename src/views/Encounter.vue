<template>
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading encounter data...</p>
  </div>
  <template v-else-if="encounterDetails">
    <section class="encounter-card" @click="goBackToEncounters()">
      <h2 class="encounter-name">{{ encounterDetails.name }}</h2>
      <p class="raid">{{ encounterDetails.raid }}</p>
      <div class="meta">
        <span><strong>Date:</strong> {{ encounterDetails.startedAt }}</span>
      </div>
    </section>

    <nav class="sub-nav">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="sub-link"
        :class="{ active: route.path === tab.path }"
        >
        {{ tab.label }}
      </RouterLink>
    </nav>
    
    <RouterView />
    
  </template>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed, provide } from 'vue'
import { useApi } from '../composables/useApi'
import { THEME_KEY } from "vue-echarts";

/**
 * Encounter Layout Component
 * 
 * Acts as a layout for Encounter sub-pages.
 * Fetches data and provides it to children.
 */

const { request } = useApi()
const route = useRoute()
const router = useRouter()

const props = defineProps({
    encounterId: String,
    encounters: Array,
    logId: String
})

const encounterId = props.encounterId;
const logId = props.logId;

const encounterDetails = computed(() => {
    return props.encounters.find(encounter => encounter.id == props.encounterId);
})

const tabs = [
  { label: 'Overview', path: `/log/${logId}/encounter/${encounterId}` },
  { label: 'Damage', path: `/log/${logId}/encounter/${encounterId}/damage` },
  { label: 'Healing', path: `/log/${logId}/encounter/${encounterId}/healing` },
  { label: 'Deaths', path: `/log/${logId}/encounter/${encounterId}/deaths` },
]

const characters = ref([])
const totals = ref({})
const statisticsPerInterval = ref([])
const loading = ref(false)

async function fetchEncounter() {
  try {
    const response = await request(`/api/log/encounter/${encounterId}`)
    if (response.characters) {
      characters.value = response.characters
    }

    if (response.totals) {
      totals.value = response.totals;
    }
  } catch (err) {
    console.error('Failed to fetch encounter', err)
  }
} 

async function fetchEncounterStatistics() {
  try {
    const response = await request(`/api/log/encounter-statistics-by-interval/${encounterId}`)
    if (response) {
      statisticsPerInterval.value = response
    }
  } catch (err) {
    console.error('Failed to fetch encounter statistics', err)
  }
} 

const goBackToEncounters = () => {
  router.push({ name: 'log', params: { logId: logId } })
}

provide(THEME_KEY, "dark");
provide('encounterDetails', encounterDetails);
provide('characters', characters);
provide('statisticsPerInterval', statisticsPerInterval);

onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchEncounter(),
    fetchEncounterStatistics()
  ])
  loading.value = false
})

</script>

<style scoped>
.sub-nav {
  display: flex;
  justify-content: left;
  padding-left: 1.2rem;
  gap: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

.sub-link {
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  padding-bottom: 0.3rem;
  transition: color 0.2s, border-color 0.2s;
}

.sub-link:hover {
  color: #3b82f6;
}

.sub-link.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #888;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>