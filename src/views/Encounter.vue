<template>
  <template v-if="encounterDetails">
    <!-- 🧩 Encounter Summary Card -->
    <section class="encounter-card">
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

    <section class="top-chart">
        <VChart class="chart" :option="chartOptions" autoresize  />
    </section>

    <section class="summary-section group-comp">
        <h3>Group Composition</h3>
        <div class="group-roles">
            <div class="role">
            <h4>Tanks</h4>
            <div class="role-list">
                <span v-for="t in tanks" :key="t.characterId" class="player">
                <img :src="`/images/spec/${t.class.toLowerCase()}/${t.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                {{ t.character }}
                </span>
            </div>
            </div>

            <div class="role">
            <h4>DPS</h4>
            <div class="role-list">
                <span v-for="d in damageDealers" :key="d.characterId" class="player">
                <img :src="`/images/spec/${d.class.toLowerCase()}/${d.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                {{ d.character }}
                </span>
            </div>
            </div>

            <div class="role">
            <h4>Healers</h4>
            <div class="role-list">
                <span v-for="h in healers" :key="h.characterId" class="player">
                <img :src="`/images/spec/${h.class.toLowerCase()}/${h.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                {{ h.character }}
                </span>
            </div>
            </div>
        </div>
        </section>
        <section class="meters-row">
            <!-- Damage -->
            <div class="meter-card">
                <h3>Damage Done by Source</h3>
                <div class="meter-list">
                  <div v-for="d in charactersOrderedByDamage" :key="d.characterId" class="bar-row">
                      <div class="bar-label">
                        <img :src="`/images/spec/${d.class.toLowerCase()}/${d.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                        <span>{{ d.character }}</span>
                      </div>
                      <div class="bar-container">
                        <div :class="['bar', 'bg-' + d.class.toLowerCase().replace(/ /g, '-')]" :style="{ width: ((d.totalDamage / topDamageDealer.totalDamage) * 100)+ '%'}"></div>
                        </div>
                      <span class="bar-value align-numbers">{{ (d.totalDamage / 1000000.000).toFixed(2) }}m</span>
                      <span class="bar-dps align-numbers">{{ formatNumber(d.totalDamage / encounterDurationInSeconds, 0) }} DPS</span>
                  </div>
                </div>
            </div>

            <!-- Healing -->
            <div class="meter-card">
                <div class="meter-list">
                 <h3>Healing Done by Source</h3>
                  <div class="meter-list">
                    <div v-for="d in charactersOrderedByHealingWithAbsorbs" :key="d.characterId" class="bar-row">
                        <div class="bar-label">
                          <img :src="`/images/spec/${d.class.toLowerCase()}/${d.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                          <span>{{ d.character }}</span>
                        </div>
                        <div class="bar-container">
                          <div :class="['bar', 'bg-' + d.class.toLowerCase().replace(/ /g, '-')]" :style="{ width: (((d.totalHealing + d.totalAbsorb) / (topHealingWithAbsorbsDealer.totalHealing + topHealingWithAbsorbsDealer.totalAbsorb)) * 100)+ '%'}"></div>
                          </div>
                        <span class="bar-value align-numbers">{{ ((d.totalHealing + d.totalAbsorb) / 1000000.000).toFixed(2) }}m</span>
                        <span class="bar-dps align-numbers">{{ formatNumber((d.totalHealing + d.totalAbsorb) / encounterDurationInSeconds, 0) }} HPS</span>
                    </div>
                  </div>
                </div>
            </div>
        </section>

    <!-- 📊 Data Table -->
    <section class="data-table-section">
        <table class="data-table">
        <thead>
            <tr>
            <th>Player</th>
            <th>Spec</th>
            <th class="text-right">DPS</th>
            <th class="text-right">HPS</th>
            <th class="text-right">Deaths</th>
            <th class="text-right">Damage Taken</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in charactersOrderedByName" :key="row.characterId">
            <td>{{ row.character   }}</td>
            <td>{{ row.spec }} {{ row.class }}</td>
            <td class="text-right align-numbers">{{ formatNumber(row.totalDamage / encounterDurationInSeconds, 0) }} DPS</td>
            <td class="text-right align-numbers">{{ formatNumber(row.totalHealing / encounterDurationInSeconds, 0) }} HPS</td>
            <td class="text-right align-numbers">{{ row.deaths }}</td>
            <td class="text-right align-numbers">{{ ((row.totalDamageTaken) / 1000000.000).toFixed(2) }}m </td>
            </tr>
        </tbody>
        </table>
    </section>
  </template>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, computed, provide } from 'vue'
import { useApi } from '../composables/useApi'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent 
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

const { request } = useApi()
const route = useRoute()

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

const encounterChosen = computed(() => route.name !== 'log')
const tankSpecs = ['Protection', 'Guardian', 'Blood', 'Brewmaster']
const healingSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver']
const ddSpecs = ['Frost', 'Unholy', 'Balance', 'Feral', 'Beast Mastery', 'Marksmanship', 'Survival', 'Arcane', 'Fire', 'Frost', 'Windwalker', 'Retribution', 'Shadow', 'Assassination', 'Combat', 'Subtlety', 'Elemental', 'Enhancement', 'Affliction', 'Demonology', 'Destruction', 'Arms', 'Fury']

const tanks = computed(() => {
  let tankChars = []
  characters.value.forEach(val => {
    if(tankSpecs.includes(val['spec'])) {
      tankChars.push(val)
    }
  })

  console.log(tankChars)

  return tankChars
})

const healers = computed(() => {
  let healerChars = []
  characters.value.forEach(val => {
    if(healingSpecs.includes(val['spec'])) {
      healerChars.push(val)
    }
  })

  return healerChars
})

const damageDealers = computed(() => {
  let dds = []
  characters.value.forEach(val => {
    if(ddSpecs.includes(val['spec'])) {
      dds.push(val)
    }
  })

  return dds
})

const charactersOrderedByName = computed(() => {
  return [...characters.value].sort((a, b) => a.character.localeCompare(b.character))
})

const charactersOrderedByDamage = computed(() => {
  return [...characters.value].sort((a, b) => b.totalDamage - a.totalDamage)
})

const topDamageDealer = computed(() => {
  if(charactersOrderedByDamage.value.length > 0) {
    return charactersOrderedByDamage.value[0]
  }
})

const charactersOrderedByHealingWithAbsorbs = computed(() => {
  return [...characters.value].sort((a, b) => (b.totalHealing + b.totalAbsorb) - (a.totalHealing + a.totalAbsorb))
})

const topHealingWithAbsorbsDealer = computed(() => {
  if(charactersOrderedByHealingWithAbsorbs.value.length > 0) {
    return charactersOrderedByHealingWithAbsorbs.value[0]
  }
})

const encounterDurationInSeconds = computed(() => {
  if (encounterDetails.value && encounterDetails.value['duration']) {
    const parts = encounterDetails.value['duration'].split(':')
    const minutes = parseInt(parts[0], 10)
    const seconds = parseInt(parts[1], 10)
    return (minutes * 60) + seconds
  }
  return 0
})

const formatNumber = (number, decimals = 2) => {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

provide(THEME_KEY, "dark");

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent 
])

const chartOptions = computed(() => {
  return {
    tooltip: { trigger: 'axis' },
    backgroundColor: '#202020',   
    grid: {
      left: '0%', 
      right: '0%', 
      top: '0%', 
      bottom: '0%', 
      containLabel: false 
    },
    xAxis: {
      type: 'category',
      data: statisticsPerInterval.value.map(p => p.secondsInterval), 
      name: ''
    },
    yAxis: { 
      type: 'value', 
      name: 'Per Second',
      nameLocation: 'middle',
      nameRotate: 90,     
      position: 'left',  
      nameGap: false,
      boundaryGap: false
    },
    series: [
      {
        name: 'Damage',
        type: 'line',
        data: statisticsPerInterval.value.map(p => (p.totalDamage / 5.0)),
        smooth: true,
        areaStyle: {},
        clip: true
      },
      {
        name: 'Healing',
        type: 'line',
        data: statisticsPerInterval.value.map(p => ((p.totalHealing + p.totalAbsorb) / 5)),
        smooth: true,
        clip: true
      }
    ]
  }
})

onMounted(() => {
  fetchEncounter()
  fetchEncounterStatistics()
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
.image-box {
  width: 100%;
  height: 250px;
  background-color: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1rem;
}

.data-table-section {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #202020;
  border: 1px solid #2a2a2a;
}

.data-table th,
.data-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #2a2a2a;
  text-align: left;
}

.data-table th {
  color: #ddd;
  background-color: #2a2a2a;
  font-weight: 600;
}

.data-table tr:hover {
  background-color: #2f2f2f;
}

.summary-section {
  margin-top: 2rem;
  background: #202020;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 1rem 1.5rem;
}

.summary-section h3 {
  margin-bottom: 1rem;
  color: #3b82f6;
}

.section-desc {
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* Group composition */
.group-roles {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 3rem;
}

.role h4 {
  color: #ccc;
  margin-bottom: 0.5rem;
}

.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.player {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #f1f1f1;
  font-weight: 500;
  background: #2a2a2a;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.class-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

.meters-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}
@media (max-width: 900px) {
  .meters-row { grid-template-columns: 1fr; }
}

/* Card styling for each meter */
.meter-card {
  background: #202020;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.meter-card h3 {
  margin: 0 0 0.75rem 0;
  color: #3b82f6;
}

/* Scrollable list if long */
.meter-list {
  max-height: 420px;       /* tweak as needed */
  overflow: auto;
  padding-right: 6px;      /* room for scrollbar */
}

/* Reuse your bar styles */
.bar-row {
  display: grid;
  grid-template-columns: 180px 1fr 100px 110px; /* label | bar | amount | rate */
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}
.bar-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.class-icon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}
.bar-container {
  background-color: #2f2f2f;
  height: 12px;
  border-radius: 4px;
  overflow: hidden;
}
.bar {
  height: 100%;
  transition: width 0.35s ease;
}
.bar-value {
  text-align: right;
  color: #ccc;
  font-size: 0.85rem;
  white-space: nowrap;
}
.bar-dps {
  text-align: right;
  color: #999;
  font-size: 0.8rem;
  white-space: nowrap;
}


.chart {
  flex: 1;
  min-width: 0;
  height: 400px;
}
</style>