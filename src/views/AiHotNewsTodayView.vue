<script setup lang="ts">
import { computed } from 'vue'
import NewsCard from '../components/NewsCard.vue'
import { formatDate } from '../composables/useDate'
import { useAiNews } from '../composables/useAiNews'

const emit = defineEmits<{
  goHistory: []
}>()

const {
  articleIdx,
  currentArticle,
  todayDaily,
  todayArticles,
  loading,
  syncing,
  error,
  hasTodayArticles,
  canSwitchArticle,
  prevArticle,
  nextArticle,
  syncTodayAiNews,
} = useAiNews()

const todayDate = computed(() => formatDate(new Date()))
</script>

<template>
  <div class="today-view">
    <div class="today-date">{{ todayDate }}</div>

    <p v-if="loading" class="status-text">加载今日热点…</p>

    <div v-else-if="!hasTodayArticles" class="empty-card glass-panel">
      <p class="empty-title">今日暂无热点</p>
      <p class="empty-desc">点击下方按钮从 aibase 获取今日 AI 热点，每天只需获取一次</p>
      <div class="empty-actions">
        <button
          class="fetch-btn"
          type="button"
          :disabled="syncing"
          @click="syncTodayAiNews"
        >
          {{ syncing ? '正在获取…' : '获取今日热点' }}
        </button>
        <button class="history-btn" type="button" @click="emit('goHistory')">
          浏览历史热点
        </button>
      </div>
      <p v-if="error" class="fetch-error">{{ error }}</p>
    </div>

    <template v-else>
      <p v-if="todayDaily?.title" class="digest-title">{{ todayDaily.title }}</p>
      <NewsCard :article="currentArticle!" :pulse-key="articleIdx" />
    </template>

    <div v-if="hasTodayArticles && !loading" class="today-footer">
      <p v-if="canSwitchArticle" class="article-index">{{ articleIdx + 1 }} / {{ todayArticles.length }}</p>

      <div class="today-actions">
        <button
          v-if="canSwitchArticle"
          class="action-btn"
          type="button"
          aria-label="上一条"
          @click="prevArticle"
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

        <button class="action-btn primary" type="button" @click="emit('goHistory')">
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
          浏览历史热点
        </button>

        <button
          v-if="canSwitchArticle"
          class="action-btn"
          type="button"
          aria-label="下一条"
          @click="nextArticle"
        >
          下一条
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
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <a
        v-if="todayDaily?.dailyPageUrl"
        class="daily-link"
        :href="todayDaily.dailyPageUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看 aibase 完整日报
      </a>
    </div>
  </div>
</template>

<style scoped>
.today-view {
  align-items: center;
  justify-content: flex-end;
  padding: 0 0 8vh;
  min-height: 52dvh;
  display: flex;
  flex-direction: column;
}

.today-date {
  display: none;
}

.digest-title {
  font-size: 13px;
  font-weight: 500;
  color: rgba(210, 218, 230, 0.55);
  letter-spacing: 0.04em;
  margin-bottom: 16px;
  text-align: center;
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
  border-radius: var(--radius-xl);
  padding: 56px 64px;
  text-align: center;
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

.empty-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.fetch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 240px;
  padding: 12px 28px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #0a0e18;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 20px var(--accent-glow);
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
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

.history-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 240px;
  padding: 10px 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.history-btn:hover {
  color: var(--fg);
  border-color: rgba(255, 255, 255, 0.15);
}

.history-btn:active {
  transform: scale(0.97);
}

.fetch-error {
  margin-top: 16px;
  font-size: 13px;
  color: oklch(55% 0.15 25);
}

.today-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 28px;
  gap: 14px;
}

.article-index {
  font-size: 12px;
  font-weight: 600;
  color: rgba(210, 218, 230, 0.65);
  letter-spacing: 0.06em;
}

.today-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
  text-decoration: none;
}

.action-btn:hover:not(:disabled) {
  color: var(--fg);
  border-color: rgba(255, 255, 255, 0.15);
}

.action-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.action-btn.primary {
  background: var(--accent);
  color: #0a0e18;
  border: none;
  font-weight: 600;
  box-shadow: 0 2px 20px var(--accent-glow);
}

.action-btn.primary:hover {
  box-shadow: 0 4px 22px var(--accent-glow);
}

.daily-link {
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0.03em;
  opacity: 0.85;
  transition: opacity 0.2s ease;
}

.daily-link:hover {
  opacity: 1;
}

@media (max-width: 720px) {
  .empty-card {
    padding: 40px 28px;
  }

  .today-actions {
    gap: 8px;
  }

  .action-btn {
    padding: 10px 16px;
    font-size: 12px;
  }
}
</style>
