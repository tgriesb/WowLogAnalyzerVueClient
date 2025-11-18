<template>
  <div>
    <main style="margin: auto;">
      <div class="log-list">
        <h2>{{ log?.name ?? 'Log' }}</h2>
        <router-view v-slot="{ Component }">
          <component :is="Component" :encounters="encounters" />
        </router-view>        
        <template v-if="!encounterChosen">
          <div v-if="loading" class="loading">Loading encounters...</div>
          <div v-else>
            <div class="encounter-card">
              <div class="encounter-info">
                <h3 class="encounter-name">
                  <RouterLink
                    :to="`/log/${log.id}/encounters`"
                    class="log-link"
                  >Encounters</RouterLink>
                </h3>
              </div>
            </div>
            <div
              v-for="encounter in encounters"
              :key="encounter.id"
              class="encounter-card"
            >
              <div class="encounter-info">
                <h3 class="encounter-name">
                  <RouterLink
                    :to="{ 
                      name: 'encounter', 
                      params: { 
                        encounterId: encounter.id,
                        logId: route.params.logId,
                      }
                    }"
                    class="log-link"
                  >{{ encounter.name }}</RouterLink>
                </h3>
              </div>
              <div class="encounter-raid">
                <p class="raid-name">{{ encounter.instance }}</p>
              </div>
              <div class="encounter-meta">
                <span v-if="encounter.success" class="duration kill">Kill ({{ encounter.duration }})</span>
                <span v-else class="duration wipe">Wipe ({{ encounter.duration }})</span>
                <span class="date">{{ encounter.startedAt }}</span>
              </div>
            </div>

            <p v-if="encounters.length === 0" class="no-data">
              No encounters found for this log.
            </p>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'

const { request } = useApi()
const router = useRouter()
const route = useRoute()

const encounters = ref([])
const log = ref([])
const loading = ref(true)

async function fetchLog() {
  try {
    const response = await request('/api/log/encounters/' + route.params.logId)
    encounters.value = response.encounters || []
    log.value = response.log || {}
    loading.value = false
  } catch (err) {
    console.error('Failed to fetch logs', err)
  }
}

const encounterChosen = computed(() => route.name !== 'log')

onMounted(() => {
  fetchLog()
})

</script>

<style>
  .log-page {
    background-color: #181818;
    color: #f1f1f1;
    padding: 2rem;
    border-radius: 10px;
    max-width: 800px;
    margin: 2rem auto;
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #fff;
  }

  .loading,
  .no-data {
    text-align: center;
    color: #888;
    margin-top: 1.5rem;
  }

  /* Encounter cards */
  .encounter-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #202020;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 1rem 1.2rem;
    margin-bottom: 1rem;
    transition: background 0.2s, transform 0.1s;
    min-height: 38px;
  }

  .encounter-card:hover {
    background: #2a2a2a;
    transform: scale(1.01);
  }

  .encounter-info {
    display: flex;
    flex-direction: column;
  }

  .encounter-name {
    color: #3b82f6;
    font-size: 1.1rem;
    margin: 0;
  }

  .raid-name {
    font-size: 0.9rem;
    color: #aaa;
    margin: 0.2rem 0 0 0;
  }

  .encounter-meta {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
  }

  .duration {
    font-weight: 600;
    color: #f1f1f1;
  }

  .date {
    font-size: 0.85rem;
    color: #999;
  }
    span.kill {
        color: green;
    }

    span.wipe {
        color: red;
    }
</style>