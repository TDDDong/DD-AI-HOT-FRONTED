<script setup lang="ts">
import { computed } from 'vue'
import QuoteCard from '../components/QuoteCard.vue'
import { formatDate } from '../composables/useDate'
import { useQuotes } from '../composables/useQuotes'

const emit = defineEmits<{
  goHistory: []
}>()

const { todayIdx, currentQuote, prevQuote } = useQuotes()

const todayDate = computed(() => formatDate(new Date()))
</script>

<template>
  <div class="today-view">
    <div class="today-date">{{ todayDate }}</div>

    <QuoteCard :quote="currentQuote" :pulse-key="todayIdx" />

    <div class="today-actions">
      <button class="action-btn" aria-label="上一条" @click="prevQuote">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        上一条
      </button>
      <button class="action-btn primary" @click="emit('goHistory')">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        浏览历史日推
      </button>
    </div>
  </div>
</template>

<style scoped>
.today-view {
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
}

.today-date {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.today-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  box-shadow: 0 1px 3px oklch(0 0 0 / 0.03);
  transition: all 0.2s;
  text-decoration: none;
}

.action-btn:hover {
  color: var(--fg);
  border-color: oklch(80% 0.008 240);
}

.action-btn:active {
  transform: scale(0.97);
}

.action-btn.primary {
  background: var(--accent);
  color: #fff;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 14px var(--accent-glow);
}

.action-btn.primary:hover {
  box-shadow: 0 4px 22px var(--accent-glow);
}
</style>
