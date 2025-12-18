<template>
  <div>
    <section class="deaths-section">
      <h3>Deaths</h3>
      <div v-if="charactersWithDeaths.length === 0" class="no-deaths">
        <p>No deaths recorded for this encounter.</p>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Spec</th>
            <th class="text-right">Deaths</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in charactersWithDeaths" :key="row.characterId">
            <td>
                <div class="player-cell">
                    <img :src="`/images/spec/${row.class.toLowerCase()}/${row.spec.toLowerCase()}.png`" alt="" class="class-icon" />
                    {{ row.character }}
                </div>
            </td>
            <td><span :class="`text-${row.class.toLowerCase().replace(/ /g, '-')}`">{{ row.spec }} {{ row.class }}</span></td>
            <td class="text-right align-numbers">{{ row.deaths }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const characters = inject('characters')

const charactersWithDeaths = computed(() => {
  return [...characters.value]
    .filter(c => c.deaths > 0)
    .sort((a, b) => b.deaths - a.deaths)
})

</script>

<style scoped>
.deaths-section {
    background: #202020;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-top: 1rem;
}

.deaths-section h3 {
    margin-bottom: 1rem;
    color: #ef4444; 
}

.no-deaths {
    color: #888;
    font-style: italic;
    padding: 1rem;
    text-align: center;
}
</style>
