<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatDate } from '../composables/useDate'
import type { HistoryQuoteItem } from '../types/quote'

const props = defineProps<{
  item: HistoryQuoteItem
}>()

const isExpanded = ref(false)
const quoteIdx = ref(0)

const quotes = computed(() => props.item.quotes)
const hasQuotes = computed(() => quotes.value.length > 0)
const canSwitch = computed(() => quotes.value.length > 1)
const currentQuote = computed(() => quotes.value[quoteIdx.value] ?? null)

watch(
  () => props.item.date.getTime(),
  () => {
    quoteIdx.value = 0
    isExpanded.value = false
  },
)

function toggle(): void {
  if (!hasQuotes.value) return
  isExpanded.value = !isExpanded.value
}

function prevQuote(event: MouseEvent): void {
  event.stopPropagation()
  if (!canSwitch.value) return
  quoteIdx.value = (quoteIdx.value - 1 + quotes.value.length) % quotes.value.length
  isExpanded.value = false
}

function nextQuote(event: MouseEvent): void {
  event.stopPropagation()
  if (!canSwitch.value) return
  quoteIdx.value = (quoteIdx.value + 1) % quotes.value.length
  isExpanded.value = false
}
</script>

<template>
  <div
    class="day-card glass-panel"
    :class="{ expanded: isExpanded, empty: !hasQuotes }"
    @click="toggle"
  >
    <div class="day-card-header">
      <span class="day-card-date">{{ formatDate(item.date) }}</span>
      <div class="day-card-meta">
        <span v-if="canSwitch" class="day-card-index">{{ quoteIdx + 1 }} / {{ quotes.length }}</span>
        <span v-if="item.isToday" class="day-card-badge">今日</span>
      </div>
    </div>

    <template v-if="currentQuote">
      <p :key="quoteIdx" class="day-card-en">{{ currentQuote.en }}</p>
      <p class="day-card-author">- {{ currentQuote.author }}</p>
      <div class="card-trans-wrap" :class="{ open: isExpanded }">
        <div class="card-trans-inner">
          <p class="card-trans-zh">{{ currentQuote.zh }}</p>
        </div>
      </div>

      <div class="day-card-footer">
        <div v-if="canSwitch" class="quote-switch" @click.stop>
          <button class="switch-btn" type="button" aria-label="上一条" @click="prevQuote">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            上一条
          </button>
          <button class="switch-btn" type="button" aria-label="下一条" @click="nextQuote">
            下一条
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
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

    <template v-else>
      <p class="day-card-empty">当日暂无例句</p>
    </template>
  </div>
</template>

<style scoped>
.day-card {
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.day-card:hover:not(.empty) {
  transform: translateY(-2px);
}

.day-card:active:not(.empty) {
  transform: scale(0.985);
}

.day-card.empty {
  cursor: default;
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
  gap: 12px;
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
  animation: quote-in 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes quote-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.day-card-author {
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.day-card-empty {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
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

.day-card-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.quote-switch {
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

.card-hint {
  display: flex;
  align-items: center;
  gap: 4px;
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

@media (prefers-reduced-motion: reduce) {
  .day-card-en {
    animation: none;
  }
}
</style>
