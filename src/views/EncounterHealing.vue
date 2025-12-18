<template>
  <div>
    <section class="top-chart">
      <VChart class="chart" :option="chartOptions" autoresize />
    </section>

    <section class="meters-section">
        <div class="meter-card full-width">
        <h3>Healing Done by Source</h3>
        <div class="meter-list">
          <div v-for="d in charactersOrderedByHealing" :key="d.characterId" class="bar-row">
            <div class="bar-label">
              <img :src="`/images/spec/${d.class.toLowerCase()}/${d.spec.toLowerCase()}.png`" alt="" class="class-icon" />
              <span>{{ d.character }}</span>
            </div>
            <div class="bar-container">
              <div :class="['bar', 'bg-' + d.class.toLowerCase().replace(/ /g, '-')]"
                :style="{ width: (((d.totalHealing + d.totalAbsorb) / (topHealingDealer.totalHealing + topHealingDealer.totalAbsorb)) * 100) + '%' }"></div>
            </div>
            <span class="bar-value align-numbers">{{ ((d.totalHealing + d.totalAbsorb) / 1000000.000).toFixed(2) }}m</span>
            <span class="bar-dps align-numbers">{{ formatNumber((d.totalHealing + d.totalAbsorb) / encounterDurationInSeconds, 0) }} HPS</span>
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
            <th class="text-right">Total Healing</th>
            <th class="text-right">HPS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in charactersOrderedByHealing" :key="row.characterId">
            <td>{{ index + 1 }}</td>
            <td>
                <div class="player-cell">
                    <img :src="`/images/spec/${row.class.toLowerCase()}/${row.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                    {{ row.character }}
                </div>
            </td>
            <td><span :class="`text-${row.class.toLowerCase().replace(/ /g, '-')}`">{{ row.spec }} {{ row.class }}</span></td>
            <td class="text-right align-numbers">{{ ((row.totalHealing + row.totalAbsorb) / 1000000.000).toFixed(2) }}m</td>
            <td class="text-right align-numbers">{{ formatNumber((row.totalHealing + row.totalAbsorb) / encounterDurationInSeconds, 0) }} HPS</td>
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


const charactersOrderedByHealing = computed(() => {
  return [...characters.value].sort((a, b) => (b.totalHealing + b.totalAbsorb) - (a.totalHealing + a.totalAbsorb))
})

const topHealingDealer = computed(() => {
  if (charactersOrderedByHealing.value.length > 0) {
    return charactersOrderedByHealing.value[0]
  }
  return { totalHealing: 0, totalAbsorb: 1 }
})

const chartOptions = computed(() => {
  const options = getBaseChartOptions(statisticsPerInterval, 'HPS');
  options.grid.left = '2%';
  options.grid.right = '2%';
  options.grid.containLabel = true;

  options.series = [
      {
        name: 'Healing',
        type: 'line',
        data: statisticsPerInterval.value.map(p => ((p.totalHealing + p.totalAbsorb) / 5)),
        areaStyle: { opacity: 0.2, color: '#22c55e' },
        itemStyle: { color: '#22c55e' },
        smooth: true,
        clip: true
      }
    ];
  return options;
})

</script>