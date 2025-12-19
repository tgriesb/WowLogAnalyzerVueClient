<template>
  <div v-if="loading" class="loading-container">
    <div class="spinner"></div>
    <p>Loading log data...</p>
  </div>
  <template v-else-if="log">
    <section class="encounter-card header-card" @click="goBackToEncounters()">
      <div class="header-content">
        <div>
          <h2 class="encounter-name">Encounters</h2>
        </div>
        <!-- <div class="controls">
            <label class="toggle-switch">
                <input type="checkbox" v-model="includeTrash" @change="fetchData">
                <span class="slider"></span>
            </label>
            <span class="toggle-label">Include Trash</span>
        </div> -->
      </div>
      <div class="meta">
        <span><strong>Total Time:</strong> {{ formattedDuration }}</span>
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

const { request } = useApi()
const router = useRouter()
const route = useRoute()

const props = defineProps({
    logId: String,
    encounters: Array
})

const logId = props.logId;
const includeTrash = ref(false);

const tabs = computed(() => [
  { label: 'Overview', path: `/log/${logId}/all/overview` },
  { label: 'Damage', path: `/log/${logId}/all/damage` },
  { label: 'Healing', path: `/log/${logId}/all/healing` },
  { label: 'Deaths', path: `/log/${logId}/all/deaths` },
]);

const log = ref(null);
const characters = ref([]);
const statisticsPerInterval = ref([]);
const loading = ref(false);
const totalDurationSeconds = ref(0);

// Mock encounterDetails to satisfy child components expecting it (e.g. for duration)
const encounterDetails = computed(() => {
    // Convert seconds back to MM:SS for display or existing utils if needed
    const minutes = Math.floor(totalDurationSeconds.value / 60);
    const seconds = totalDurationSeconds.value % 60;
    const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return {
        name: "All Encounters",
        duration: durationStr,
        ...log.value
    };
});

const formattedDuration = computed(() => encounterDetails.value.duration);


async function fetchLogDetails() {
  try {
    const response = await request(`/api/log/log-details/${logId}?includeTrash=${includeTrash.value}`)
    if (response.characters) {
      characters.value = response.characters
    }
    if (response.log) {
        log.value = response.log;
    }
  } catch (err) {
    console.error('Failed to fetch log details', err)
  }
} 

async function fetchLogStatistics() {
  try {
    const response = await request(`/api/log/log-encounter-statistics-by-interval/${logId}?includeTrash=${includeTrash.value}`)
    if (response) {
      statisticsPerInterval.value = response
      
      // Calculate total duration from stats if possible, or we need to sum up actual encounter durations.
      // The statisticsPerInterval for 'All' is already concatenated. 
      // The last interval's timestamp roughly gives us total duration if we assume continuity, 
      // but actually for aggregation we probably want the sum of active combat time.
      // Let's assume the backend 'GetLogEncounterStatisticsByInterval' returns a continuous stream of buckets.
      if (statisticsPerInterval.value.length > 0) {
          const lastStat = statisticsPerInterval.value[statisticsPerInterval.value.length - 1];
          // Each interval is 5 seconds
          totalDurationSeconds.value = lastStat.secondsInterval + 5; 
      } else {
          totalDurationSeconds.value = 0;
      }
    }
  } catch (err) {
    console.error('Failed to fetch log statistics', err)
  }
} 

async function fetchData() {
    loading.value = true;
    await Promise.all([
        fetchLogDetails(),
        fetchLogStatistics()
    ]);
    loading.value = false;
}

const goBackToEncounters = () => {
  router.push({ name: 'log', params: { logId: logId } })
}

provide(THEME_KEY, "dark");
provide('encounterDetails', encounterDetails);
provide('characters', characters);
provide('statisticsPerInterval', statisticsPerInterval);

onMounted(() => {
  fetchData();
})

</script>

<style scoped>


.header-card:hover {
    background: #202020; /* Reset hover effect */
    transform: none;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}

.controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

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

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.toggle-label {
    font-size: 0.9rem;
    color: #ccc;
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
