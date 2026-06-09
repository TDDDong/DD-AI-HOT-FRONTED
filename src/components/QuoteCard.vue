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
  <article ref="cardRef" class="quote-card">
    <div class="quote-mark">&ldquo;</div>
    <div class="quote-body">
      <p class="quote-en">{{ quote.en }}</p>
      <p class="quote-author">— {{ quote.author }}</p>

      <button
        class="translate-btn"
        :class="{ open: isTranslationOpen }"
        @click="toggleTranslation"
      >
        <span>{{ isTranslationOpen ? '收起翻译' : '查看翻译' }}</span>
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
      </button>

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
  max-width: 720px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 56px 64px;
  position: relative;
  box-shadow:
    0 4px 32px oklch(0 0 0 / 0.05),
    0 1px 2px oklch(0 0 0 / 0.03);
  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
  overflow: hidden;
}

.quote-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), oklch(68% 0.12 140), oklch(56% 0.12 170));
}

.quote-mark {
  position: absolute;
  top: 36px;
  left: 40px;
  font-family: var(--font-display);
  font-size: 120px;
  line-height: 1;
  color: var(--accent-soft);
  pointer-events: none;
}

.quote-body {
  position: relative;
  z-index: 1;
}

.quote-en {
  font-family: var(--font-display);
  font-size: clamp(24px, 3.5vw, 36px);
  line-height: 1.45;
  letter-spacing: -0.015em;
  font-weight: 400;
  color: var(--fg);
  text-wrap: pretty;
  margin-bottom: 16px;
}

.quote-author {
  font-size: 15px;
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 32px;
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
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
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

.translate-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  background: var(--accent-soft);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.02em;
  transition:
    background 0.2s,
    transform 0.2s;
}

.translate-btn:hover {
  background: oklch(56% 0.12 170 / 0.14);
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
  transform: rotate(180deg);
}

@media (max-width: 720px) {
  .quote-card {
    padding: 40px 28px;
  }

  .quote-mark {
    top: 24px;
    left: 20px;
    font-size: 80px;
  }
}
</style>
