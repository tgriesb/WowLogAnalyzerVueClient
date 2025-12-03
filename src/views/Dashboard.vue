<template>
  <div>
    <main style="margin: auto;">
      <div class="log-list">
        <h2>My Logs</h2>

        <vue-good-table
          :columns="columns"
          :rows="logs"
          :pagination-options="paginationOptions"
          :search-options="{ enabled: true }"
          theme="nocturnal"
        >
          <template #table-row="props">
            <RouterLink
              v-if="props.column.field === 'name'"
              :to="`/log/${props.row.id}`"
              class="log-link"
            >
              {{ props.row.name }}
            </RouterLink>
            <template v-else>
              {{ props.formattedRow[props.column.field] }}
            </template>
          </template>
        </vue-good-table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'

const { request } = useApi()
const router = useRouter()

const logs = ref([])
const columns = [
  { label: 'Name', field: 'name' },
  { label: 'Guild', field: 'guildName' },
  { 
    label: 'Date', 
    field: 'uploadDate', 
    type: 'date',
    dateInputFormat: "MM/dd/yyyy hh:mm a", 
    dateOutputFormat: "MM/dd/yyyy hh:mm a", 
  },
]
const paginationOptions = {
  enabled: true,
  mode: 'records',
  perPage: 10,
}

async function fetchLogs() {
  try {
    const response = await request('/api/log')
    logs.value = response || []
  } catch (err) {
    console.error('Failed to fetch logs', err)
  }
}

onMounted(fetchLogs)
</script>

<style scoped>
.log-list {
  color: #eee;
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 8px;
}

h2 {
  margin-bottom: 1rem;
  color: #fff;
}

/* Make the table fit dark mode better */
.vgt-table {
  background-color: #2a2a2a !important;
  color: #eee !important;
}

.vgt-table th {
  background-color: #333 !important;
  color: #fff !important;
}

.vgt-table tr:hover {
  background-color: #3a3a3a !important;
}
</style>