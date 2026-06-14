<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Quote } from '../types/quote'

const props = defineProps<{
  quote: Quote
  pulseKey?: number
}>()

const cardRef = ref<HTMLElement | null>(null)
const isTranslationOpen = ref(false)

function toggleTranslation(): void {
  isTranslationOpen.value = !isTranslationOpen.value
}

function resetTranslation(): void {
  isTranslationOpen.value = false
}

watch(
  () => props.pulseKey,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return

    const card = cardRef.value
    if (!card) return

    card.style.transition = 'none'
    card.style.transform = 'scale(0.985)'
    requestAnimationFrame(() => {
      card.style.transition = 'transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)'
      card.style.transform = 'scale(1)'
    })
    resetTranslation()
  },
)

</script>

<template>
  <article ref="cardRef" class="quote-card glass-panel">
    <div class="quote-mark">&ldquo;</div>
    <div class="quote-body">
      <p class="quote-en">{{ quote.en }}</p>
      <p class="quote-author">- {{ quote.author }}</p>

      <div class="quote-actions">
        <button
          class="translate-btn"
          :class="{ open: isTranslationOpen }"
          @click="toggleTranslation"
        >
          <span>{{ isTranslationOpen ? '收起中文' : '点击查看中文' }}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div class="translation-wrap" :class="{ open: isTranslationOpen }">
        <div class="translation-inner">
          <p class="translation-zh">{{ quote.zh }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.quote-card {
  width: 100%;
  max-width: 820px;
  border-radius: 20px;
  padding: 48px 56px 40px;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
}

.quote-mark {
  display: none;
}

.quote-body {
  position: relative;
  z-index: 1;
}

.quote-en {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.8vw, 28px);
  line-height: 1.55;
  letter-spacing: 0.01em;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.94);
  text-wrap: pretty;
  margin-bottom: 20px;
}

.quote-author {
  font-size: 14px;
  color: rgba(210, 218, 230, 0.65);
  font-weight: 400;
  letter-spacing: 0.04em;
  margin-bottom: 36px;
}

.translation-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.translation-wrap.open {
  grid-template-rows: 1fr;
}

.translation-inner {
  overflow: hidden;
}

.translation-zh {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(210, 218, 230, 0.78);
  letter-spacing: 0.01em;
  text-wrap: pretty;
  padding-bottom: 4px;
  transition: opacity 0.35s 0.15s;
}

.translation-wrap:not(.open) .translation-zh {
  opacity: 0;
}

.translation-wrap.open .translation-zh {
  opacity: 1;
}

.quote-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.translate-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.04em;
  transition:
    background 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.translate-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.translate-btn:active {
  transform: scale(0.97);
}

.translate-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.translate-btn.open svg {
  transform: rotate(-90deg);
}

@media (max-width: 720px) {
  .quote-card {
    padding: 32px 24px 28px;
  }
}
</style>
