<template>
  <div>
    <section class="top-chart">
      <VChart class="chart" :option="chartOptions" autoresize />
    </section>

    <section class="meters-section">
        <div class="meter-card full-width">
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
    </section>

    <section class="data-table-section">
      <table class="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Spec</th>
            <th class="text-right">Total Damage</th>
            <th class="text-right">DPS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in charactersOrderedByDamage" :key="row.characterId">
            <td>{{ index + 1 }}</td>
            <td>
                <div class="player-cell">
                    <img :src="`/images/spec/${row.class.toLowerCase()}/${row.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                    {{ row.character }}
                </div>
            </td>
            <td><span :class="`text-${row.class.toLowerCase().replace(/ /g, '-')}`">{{ row.spec }} {{ row.class }}</span></td>
            <td class="text-right align-numbers">{{ ((row.totalDamage) / 1000000.000).toFixed(2) }}m</td>
            <td class="text-right align-numbers">{{ formatNumber(row.totalDamage / encounterDurationInSeconds, 0) }} DPS</td>
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

const encounterDetails = inject('encounterDetails')
const characters = inject('characters')
const statisticsPerInterval = inject('statisticsPerInterval')

const encounterDurationInSeconds = computed(() => getEncounterDuration(encounterDetails))

const charactersOrderedByDamage = computed(() => {
  return [...characters.value].sort((a, b) => b.totalDamage - a.totalDamage)
})

const topDamageDealer = computed(() => {
  if (charactersOrderedByDamage.value.length > 0) {
    return charactersOrderedByDamage.value[0]
  }
  return { totalDamage: 1 }
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
      }
    ];
  return options;
})

</script>