<template>
  <div>
    <section class="top-chart">
      <VChart class="chart" :option="chartOptions" autoresize />
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
      <div class="meter-card">
        <h3>Damage Done by Source</h3>
        <div class="meter-list">
          <div v-for="d in charactersOrderedByDamage" :key="d.characterId" class="bar-row">
            <div class="bar-label">
              <img :src="`/images/spec/${d.class.toLowerCase()}/${d.spec.toLowerCase()}.png`" alt="" class="class-icon" />
              <span>{{ d.character }}</span>
            </div>
            <div class="bar-container">
              <div :class="['bar', 'bg-' + d.class.toLowerCase().replace(/ /g, '-')]"
                :style="{ width: ((d.totalDamage / topDamageDealer.totalDamage) * 100) + '%' }"></div>
            </div>
            <span class="bar-value align-numbers">{{ (d.totalDamage / 1000000.000).toFixed(2) }}m</span>
            <span class="bar-dps align-numbers">{{ formatNumber(d.totalDamage / encounterDurationInSeconds, 0)
              }} DPS</span>
          </div>
        </div>
      </div>

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
                <div :class="['bar', 'bg-' + d.class.toLowerCase().replace(/ /g, '-')]"
                  :style="{ width: (((d.totalHealing + d.totalAbsorb) / (topHealingWithAbsorbsDealer.totalHealing + topHealingWithAbsorbsDealer.totalAbsorb)) * 100) + '%' }">
                </div>
              </div>
              <span class="bar-value align-numbers">{{ ((d.totalHealing + d.totalAbsorb) /
                1000000.000).toFixed(2) }}m</span>
              <span class="bar-dps align-numbers">{{ formatNumber((d.totalHealing + d.totalAbsorb) /
                encounterDurationInSeconds, 0) }} HPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>

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
            <td>{{ row.character }}</td>
            <td>{{ row.spec }} {{ row.class }}</td>
            <td class="text-right align-numbers">{{ formatNumber(row.totalDamage / encounterDurationInSeconds, 0) }} DPS</td>
            <td class="text-right align-numbers">{{ formatNumber(row.totalHealing / encounterDurationInSeconds, 0) }} HPS</td>
            <td class="text-right align-numbers">{{ row.deaths }}</td>
            <td class="text-right align-numbers">{{ ((row.totalDamageTaken) / 1000000.000).toFixed(2) }}m </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import VChart, { THEME_KEY } from "vue-echarts";
import { useEncounterUtils } from '../composables/useEncounterUtils'

const { registerChartComponents, formatNumber, getEncounterDuration, getBaseChartOptions } = useEncounterUtils();
registerChartComponents();

// Inject data from parent Encounter.vue
const encounterDetails = inject('encounterDetails')
const characters = inject('characters')
const statisticsPerInterval = inject('statisticsPerInterval')

const encounterDurationInSeconds = computed(() => getEncounterDuration(encounterDetails))

// Computed Properties
const tankSpecs = ['Protection', 'Guardian', 'Blood', 'Brewmaster']
const healingSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver']
const ddSpecs = ['Frost', 'Unholy', 'Balance', 'Feral', 'Beast Mastery', 'Marksmanship', 'Survival', 'Arcane', 'Fire', 'Windwalker', 'Retribution', 'Shadow', 'Assassination', 'Combat', 'Subtlety', 'Elemental', 'Enhancement', 'Affliction', 'Demonology', 'Destruction', 'Arms', 'Fury']

const tanks = computed(() => {
  return characters.value.filter(val => tankSpecs.includes(val['spec']))
})

const healers = computed(() => {
  return characters.value.filter(val => healingSpecs.includes(val['spec']))
})

const damageDealers = computed(() => {
  return characters.value.filter(val => ddSpecs.includes(val['spec']))
})

const charactersOrderedByName = computed(() => {
  return [...characters.value].sort((a, b) => a.character.localeCompare(b.character))
})

const charactersOrderedByDamage = computed(() => {
  return [...characters.value].sort((a, b) => b.totalDamage - a.totalDamage)
})

const topDamageDealer = computed(() => {
  if (charactersOrderedByDamage.value.length > 0) {
    return charactersOrderedByDamage.value[0]
  }
  return { totalDamage: 1 }
})

const charactersOrderedByHealingWithAbsorbs = computed(() => {
  return [...characters.value].sort((a, b) => (b.totalHealing + b.totalAbsorb) - (a.totalHealing + a.totalAbsorb))
})

const topHealingWithAbsorbsDealer = computed(() => {
  if (charactersOrderedByHealingWithAbsorbs.value.length > 0) {
    return charactersOrderedByHealingWithAbsorbs.value[0]
  }
  return { totalHealing: 0, totalAbsorb: 1 } // Safe default
})


const chartOptions = computed(() => {
  const options = getBaseChartOptions(statisticsPerInterval);
  options.grid.left = '2%';
  options.grid.right = '2%';
  options.grid.containLabel = true;

  options.series = [
      {
        name: 'Damage',
        type: 'line',
        data: statisticsPerInterval.value.map(p => (p.totalDamage / 5.0)),
        itemStyle: { color: '#3b82f6' },
        areaStyle: { opacity: 0.2, color: '#3b82f6' },
        smooth: true,
        clip: true
      },
      {
        name: 'Healing',
        type: 'line',
        data: statisticsPerInterval.value.map(p => ((p.totalHealing + p.totalAbsorb) / 5)),
        itemStyle: { color: '#22c55e' },
        smooth: true,
        clip: true
      }
    ];
    return options;
})

</script>

<style scoped>
/* Only unique styles for this component remain */

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

.meters-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}
@media (max-width: 900px) {
  .meters-row { grid-template-columns: 1fr; }
}

</style>
