<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '../composables/useDate'
import type { HistoryQuoteItem } from '../types/quote'

defineProps<{
  item: HistoryQuoteItem
}>()

const isExpanded = ref(false)

function toggle(): void {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="day-card" :class="{ expanded: isExpanded }" @click="toggle">
    <div class="day-card-header">
      <span class="day-card-date">{{ formatDate(item.date) }}</span>
      <span v-if="item.isToday" class="day-card-badge">今日</span>
    </div>
    <p class="day-card-en">{{ item.quote.en }}</p>
    <p class="day-card-author">— {{ item.quote.author }}</p>
    <div class="card-trans-wrap" :class="{ open: isExpanded }">
      <div class="card-trans-inner">
        <p class="card-trans-zh">{{ item.quote.zh }}</p>
      </div>
    </div>
    <div class="card-hint">
      <span>{{ isExpanded ? '收起翻译' : '查看翻译' }}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.day-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  box-shadow:
    0 2px 12px oklch(0 0 0 / 0.04),
    0 1px 2px oklch(0 0 0 / 0.02);
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 28px oklch(0 0 0 / 0.07),
    0 2px 4px oklch(0 0 0 / 0.03);
}

.day-card:active {
  transform: scale(0.985);
}

.day-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--accent), oklch(68% 0.12 140));
}

.day-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.day-card-date {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--muted);
  text-transform: uppercase;
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

.day-card-en {
  font-family: var(--font-display);
  font-size: 17px;
  line-height: 1.5;
  letter-spacing: -0.01em;
  font-weight: 400;
  color: var(--fg);
  text-wrap: pretty;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.day-card-author {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.card-trans-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.card-trans-wrap.open {
  grid-template-rows: 1fr;
}

.card-trans-inner {
  overflow: hidden;
}

.card-trans-zh {
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  letter-spacing: 0.01em;
  padding-top: 12px;
  transition: opacity 0.3s 0.1s;
}

.card-trans-wrap:not(.open) .card-trans-zh {
  opacity: 0;
}

.card-trans-wrap.open .card-trans-zh {
  opacity: 1;
}

.card-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.card-hint svg {
  width: 12px;
  height: 12px;
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.day-card.expanded .card-hint svg {
  transform: rotate(180deg);
}
</style>
