<script setup lang="ts">
import DayCard from '../components/DayCard.vue'
import { useQuotes } from '../composables/useQuotes'

const { historyItems, loading, error } = useQuotes()
</script>

<template>
  <div class="history-view">
    <div class="history-header">
      <h2>历史日推</h2>
      <span class="history-count">近 7 天</span>
    </div>

    <p v-if="loading" class="status-text">加载中…</p>
    <p v-else-if="error" class="status-text error">{{ error }}</p>

    <div v-else class="history-grid">
      <DayCard v-for="(item, index) in historyItems" :key="index" :item="item" />
    </div>
  </div>
</template>

<style scoped>
.history-view {
  padding: 20px 0;
}

.history-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 32px;
}

.history-header h2 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.history-count {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.status-text {
  font-size: 14px;
  color: var(--muted);
}

.status-text.error {
  color: oklch(55% 0.15 25);
}

@media (max-width: 720px) {
  .history-grid {
    grid-template-columns: 1fr;
  }

  .history-header {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
