<script setup lang="ts">
defineOptions({ name: 'TwitterAuthorDetailView' })

import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import TweetCard from '../components/TweetCard.vue'
import TwitterAuthorProfile from '../components/TwitterAuthorProfile.vue'
import { formatApiDateTime } from '../composables/useDate'
import { resolveTwitterAuthorSeed } from '../composables/twitterAuthorSeed'
import { useTwitterAuthor } from '../composables/useTwitterAuthor'
import type { TwitterFollowingItem } from '../types/twitter'

const props = defineProps<{
  handle: string
  seedAuthor?: TwitterFollowingItem
}>()

const router = useRouter()

const {
  posts,
  author,
  loading,
  syncing,
  error,
  syncError,
  syncMessage,
  lastSyncResult,
  hasPosts,
  loadAuthorDetail,
  runSync,
} = useTwitterAuthor()
const screenName = computed(() => props.handle.replace(/^@/, ''))

const profileAuthor = computed<TwitterFollowingItem | null>(() => {
  return props.seedAuthor ?? author.value
})

const syncModeLabel = computed(() => {
  if (!lastSyncResult.value) return null
  return lastSyncResult.value.syncMode === 'INITIAL' ? '首次拉取' : '增量同步'
})

function enterAuthor(handle: string, seed?: TwitterFollowingItem): void {
  const resolved = seed ?? resolveTwitterAuthorSeed(handle)
  if (resolved) {
    author.value = resolved
  }
  loadAuthorDetail(handle, resolved)
}

async function handleSync(): Promise<void> {
  try {
    await runSync(screenName.value)
  } catch {
    // syncError 已写入 composable
  }
}

enterAuthor(screenName.value, props.seedAuthor)

watch(
  () => props.handle,
  (handle) => {
    enterAuthor(handle.replace(/^@/, ''), props.seedAuthor)
  },
)
</script>

<template>
  <div class="author-detail-view">
    <button class="back-btn" type="button" @click="router.push({ name: 'twitterFeed' })">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      返回列表
    </button>

    <TwitterAuthorProfile :author="profileAuthor" :handle="screenName" />

    <section class="tweets-section">
      <p v-if="syncMessage" class="sync-message">{{ syncMessage }}</p>
      <p v-if="syncError" class="sync-error">{{ syncError }}</p>
      <p v-if="syncModeLabel && lastSyncResult && !syncing && hasPosts" class="sync-mode">
        {{ syncModeLabel }}
        <span v-if="lastSyncResult.cursorUsed"> · 游标 {{ formatApiDateTime(lastSyncResult.cursorUsed) }}</span>
      </p>

      <ul v-if="hasPosts" class="tweet-list">
        <li v-for="post in posts" :key="post.articleId">
          <TweetCard :post="post" />
        </li>
      </ul>

      <div v-if="hasPosts" class="tweets-footer">
        <button class="sync-btn" type="button" :disabled="syncing || loading" @click="handleSync">
          {{ syncing ? '同步中…' : '同步推文' }}
        </button>
      </div>

      <div v-else-if="loading" class="tweets-status">加载推文…</div>

      <p v-else-if="error" class="error-text">{{ error }}</p>

      <div v-else class="empty-card glass-panel">
        <p class="empty-title">暂无推文</p>
        <p class="empty-desc">点击同步从 X 拉取该博主的最新推文</p>
        <button class="sync-btn" type="button" :disabled="syncing" @click="handleSync">
          {{ syncing ? '同步中…' : '同步推文' }}
        </button>
      </div>

      <p v-if="syncing && hasPosts" class="syncing-hint">正在同步最新推文…</p>
    </section>  </div>
</template>

<style scoped>
.author-detail-view {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(210, 218, 230, 0.72);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #fff;
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.tweets-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tweets-footer {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

.tweets-status {  padding: 8px 0;
  font-size: 14px;
  color: var(--muted);
}

.sync-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #0a0e18;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 16px var(--accent-glow);
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
  flex-shrink: 0;
}

.sync-btn:hover:not(:disabled) {
  box-shadow: 0 4px 20px var(--accent-glow);
}

.sync-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sync-message {
  font-size: 13px;
  color: var(--accent);
}

.sync-error {
  font-size: 13px;
  color: oklch(55% 0.15 25);
  line-height: 1.5;
}

.sync-mode {
  font-size: 12px;
  color: rgba(180, 190, 210, 0.55);
}

.error-text {
  font-size: 14px;
  color: oklch(55% 0.15 25);
  padding: 8px 0;
}

.empty-card {
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  text-align: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.tweet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.syncing-hint {
  text-align: center;
  font-size: 13px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .sync-btn {
    width: 100%;
  }

  .empty-card {    padding: 32px 24px;
  }
}
</style>
