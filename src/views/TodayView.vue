<script setup lang="ts">
import { computed } from 'vue'
import QuoteCard from '../components/QuoteCard.vue'
import { formatDate } from '../composables/useDate'
import { useQuotes } from '../composables/useQuotes'

const emit = defineEmits<{
  goHistory: []
}>()

const {
  todayIdx,
  currentQuote,
  loading,
  syncing,
  error,
  hasTodaySentences,
  canPrevQuote,
  prevQuote,
  syncTodaySentences,
} = useQuotes()

const todayDate = computed(() => formatDate(new Date()))
</script>

<template>
  <div class="today-view">
    <div class="today-date">{{ todayDate }}</div>

    <p v-if="loading" class="status-text">加载今日例句…</p>
    <p v-else-if="error && !hasTodaySentences" class="status-text error">{{ error }}</p>

    <div v-else-if="!hasTodaySentences" class="empty-card">
      <p class="empty-title">今日暂无短句</p>
      <p class="empty-desc">点击下方按钮获取今日英语短句，每天只需获取一次</p>
      <button
        class="fetch-btn"
        type="button"
        :disabled="syncing"
        @click="syncTodaySentences"
      >
        {{ syncing ? '正在获取…' : '获取今日短句' }}
      </button>
      <p v-if="error" class="fetch-error">{{ error }}</p>
    </div>

    <QuoteCard v-else :quote="currentQuote!" :pulse-key="todayIdx" />

    <div v-if="hasTodaySentences && !loading" class="today-actions">
      <button
        class="action-btn"
        aria-label="上一条"
        :disabled="!canPrevQuote"
        @click="prevQuote"
      >
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

.status-text {
  font-size: 15px;
  color: var(--muted);
  padding: 48px 0;
}

.status-text.error {
  color: oklch(55% 0.15 25);
}

.empty-card {
  width: 100%;
  max-width: 720px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 56px 64px;
  text-align: center;
  box-shadow:
    0 4px 32px oklch(0 0 0 / 0.05),
    0 1px 2px oklch(0 0 0 / 0.03);
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 28px;
  line-height: 1.6;
}

.fetch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 14px var(--accent-glow);
  transition: all 0.2s;
}

.fetch-btn:hover:not(:disabled) {
  box-shadow: 0 4px 22px var(--accent-glow);
}

.fetch-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.fetch-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.fetch-error {
  margin-top: 16px;
  font-size: 13px;
  color: oklch(55% 0.15 25);
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

.action-btn:hover:not(:disabled) {
  color: var(--fg);
  border-color: oklch(80% 0.008 240);
}

.action-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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

@media (max-width: 720px) {
  .empty-card {
    padding: 40px 28px;
  }
}
</style>
