<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatDate } from '../composables/useDate'
import type { HistoryNewsDayItem } from '../types/aiNews'

const props = defineProps<{
  item: HistoryNewsDayItem
}>()

const articleIdx = ref(0)

const articles = computed(() => props.item.articles)
const hasArticles = computed(() => articles.value.length > 0)
const canSwitch = computed(() => articles.value.length > 1)
const currentArticle = computed(() => articles.value[articleIdx.value] ?? null)

watch(
  () => props.item.date.getTime(),
  () => {
    articleIdx.value = 0
  },
)

function prevArticle(event: MouseEvent): void {
  event.stopPropagation()
  if (!canSwitch.value) return
  articleIdx.value = (articleIdx.value - 1 + articles.value.length) % articles.value.length
}

function nextArticle(event: MouseEvent): void {
  event.stopPropagation()
  if (!canSwitch.value) return
  articleIdx.value = (articleIdx.value + 1) % articles.value.length
}
</script>

<template>
  <div class="day-card glass-panel" :class="{ empty: !hasArticles }">
    <template v-if="currentArticle">
      <a
        class="source-link"
        :href="currentArticle.url"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >
        阅读原文
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>

      <div class="day-card-header">
        <span class="day-card-date">{{ formatDate(item.date) }}</span>
        <div class="day-card-meta">
          <span v-if="hasArticles" class="day-card-count">{{ articles.length }} 条</span>
          <span v-if="canSwitch" class="day-card-index">{{ articleIdx + 1 }} / {{ articles.length }}</span>
          <span v-if="item.isToday" class="day-card-badge">今日</span>
        </div>
      </div>

      <p :key="articleIdx" class="day-card-title">{{ currentArticle.title }}</p>
      <p class="day-card-summary">{{ currentArticle.summary }}</p>

      <div v-if="canSwitch" class="day-card-footer">
        <div class="article-switch">
          <button class="switch-btn" type="button" aria-label="上一条" @click="prevArticle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            上一条
          </button>
          <button class="switch-btn" type="button" aria-label="下一条" @click="nextArticle">
            下一条
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="day-card-header">
        <span class="day-card-date">{{ formatDate(item.date) }}</span>
        <span v-if="item.isToday" class="day-card-badge">今日</span>
      </div>
      <p class="day-card-empty">当日暂无热点</p>
    </template>
  </div>
</template>

<style scoped>
.day-card {
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.day-card:not(.empty):hover {
  transform: translateY(-2px);
}

.day-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--accent), rgba(184, 144, 104, 0.4));
}

.source-link {
  position: absolute;
  top: 20px;
  right: 22px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.03em;
  opacity: 0.9;
  z-index: 1;
  transition: opacity 0.2s ease;
}

.source-link:hover {
  opacity: 1;
}

.source-link svg {
  width: 12px;
  height: 12px;
}

.day-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
  padding-right: 64px;
}

.day-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.day-card-date {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--muted);
  text-transform: uppercase;
}

.day-card-count {
  font-size: 11px;
  font-weight: 600;
  color: rgba(210, 218, 230, 0.55);
  letter-spacing: 0.04em;
}

.day-card-index {
  font-size: 11px;
  font-weight: 600;
  color: rgba(210, 218, 230, 0.65);
  letter-spacing: 0.04em;
}

.day-card-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.03em;
}

.day-card-title {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 600;
  color: var(--fg);
  text-wrap: pretty;
  margin-bottom: 10px;
  animation: article-in 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.day-card-summary {
  font-size: 13px;
  line-height: 1.65;
  color: var(--muted);
  letter-spacing: 0.01em;
  text-wrap: pretty;
}

@keyframes article-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.day-card-empty {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
}

.day-card-footer {
  margin-top: 14px;
}

.article-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.switch-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.switch-btn:hover {
  color: var(--fg);
  border-color: rgba(255, 255, 255, 0.15);
}

.switch-btn:active {
  transform: scale(0.97);
}

.switch-btn svg {
  width: 14px;
  height: 14px;
}

@media (prefers-reduced-motion: reduce) {
  .day-card-title {
    animation: none;
  }
}
</style>
