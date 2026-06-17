<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AiNewsArticle } from '../types/aiNews'

const props = defineProps<{
  article: AiNewsArticle
  pulseKey?: number
}>()

const cardRef = ref<HTMLElement | null>(null)

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
  },
)
</script>

<template>
  <article ref="cardRef" class="news-card glass-panel">
    <a
      class="source-link"
      :href="article.url"
      target="_blank"
      rel="noopener noreferrer"
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

    <div class="news-rank">#{{ article.rankNo }}</div>
    <h2 class="news-title">{{ article.title }}</h2>

    <div v-if="article.hotwords.length" class="news-tags">
      <span v-for="tag in article.hotwords" :key="tag" class="news-tag">{{ tag }}</span>
    </div>

    <p class="news-summary">{{ article.summary }}</p>
  </article>
</template>

<style scoped>
.news-card {
  width: 100%;
  max-width: 820px;
  border-radius: 20px;
  padding: 40px 52px 36px;
  position: relative;
  transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
}

.source-link {
  position: absolute;
  top: 22px;
  right: 28px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.03em;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.source-link:hover {
  opacity: 1;
}

.source-link svg {
  width: 13px;
  height: 13px;
}

.news-rank {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 16px;
}

.news-title {
  font-family: var(--font-body);
  font-size: clamp(18px, 2.4vw, 24px);
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.94);
  text-wrap: pretty;
  margin-bottom: 16px;
  padding-right: 72px;
}

.news-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.news-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 4px 12px;
  border-radius: 999px;
}

.news-summary {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(210, 218, 230, 0.78);
  letter-spacing: 0.01em;
  text-wrap: pretty;
}

@media (max-width: 720px) {
  .news-card {
    padding: 28px 22px 24px;
  }

  .source-link {
    top: 18px;
    right: 18px;
  }

  .news-title {
    padding-right: 0;
    padding-top: 28px;
  }
}
</style>
