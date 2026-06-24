<script setup lang="ts">
defineOptions({ name: 'TwitterFollowingView' })

import { onMounted } from 'vue'
import FollowingAuthorCard from '../components/FollowingAuthorCard.vue'
import { formatApiDateTime } from '../composables/useDate'
import { useTwitterFeed } from '../composables/useTwitterFeed'

const {
  following,
  ownerScreenName,
  listFetchedAt,
  total,
  loading,
  refreshing,
  error,
  refreshError,
  refreshMessage,
  hasFollowing,
  needsRefresh,
  loadFollowing,
  refreshFollowingFromX,
} = useTwitterFeed()

async function handleRefreshFollowing(): Promise<void> {
  try {
    await refreshFollowingFromX()
  } catch {
    // refreshError 已写入 composable
  }
}

onMounted(() => {
  loadFollowing()
})
</script>

<template>
  <div class="following-view">
    <p v-if="loading" class="status-text">加载订阅博主…</p>

    <div v-else-if="error" class="empty-card glass-panel">
      <p class="empty-title">无法读取订阅博主</p>
      <p class="empty-desc">{{ error }}</p>
      <button class="refresh-btn" type="button" :disabled="loading" @click="loadFollowing()">
        重新加载
      </button>
    </div>

    <template v-else>
      <div v-if="needsRefresh" class="empty-card glass-panel">
        <p class="empty-title">尚未刷新关注列表</p>
        <p class="empty-desc">首次使用需从 X 拉取当前账号的关注博主并落库，之后列表页将直接读库展示</p>
        <button class="refresh-btn" type="button" :disabled="refreshing" @click="handleRefreshFollowing">
          {{ refreshing ? '刷新中…' : '刷新关注' }}
        </button>
        <p v-if="refreshError" class="feedback error">{{ refreshError }}</p>
      </div>

      <template v-else>
        <div class="list-toolbar">
          <div class="list-meta">
            <p class="list-count">
              共 {{ total || following.length }} 位订阅博主
              <span v-if="ownerScreenName" class="owner">@{{ ownerScreenName }}</span>
            </p>
            <p v-if="listFetchedAt" class="list-fetched">
              关注列表同步于 {{ formatApiDateTime(listFetchedAt) }}
            </p>
          </div>
          <button class="refresh-btn subtle" type="button" :disabled="refreshing" @click="handleRefreshFollowing">
            {{ refreshing ? '刷新中…' : '刷新关注' }}
          </button>
        </div>

        <p v-if="refreshMessage" class="feedback success">{{ refreshMessage }}</p>
        <p v-if="refreshError" class="feedback error">{{ refreshError }}</p>

        <div v-if="!hasFollowing" class="empty-inline glass-panel">
          <p class="empty-title">暂无关注博主</p>
          <p class="empty-desc">可再次从 X 刷新关注列表</p>
        </div>

        <ul v-else class="author-list">
          <li v-for="author in following" :key="author.id">
            <FollowingAuthorCard :author="author" />
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<style scoped>
.following-view {
  width: 100%;
  padding-bottom: 48px;
}

.status-text {
  text-align: center;
  font-size: 15px;
  color: var(--muted);
  padding: 48px 0;
}

.empty-card {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  text-align: center;
}

.empty-inline {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  padding: 32px 28px;
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
  margin-bottom: 24px;
}

.empty-inline .empty-desc {
  margin-bottom: 0;
}

.refresh-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 999px;
  background: var(--accent);
  color: #0a0e18;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 16px var(--accent-glow);
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.refresh-btn:hover:not(:disabled) {
  box-shadow: 0 4px 20px var(--accent-glow);
}

.refresh-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-btn.subtle {
  padding: 8px 16px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--fg);
  border: 1px solid var(--border);
  box-shadow: none;
  flex-shrink: 0;
}

.refresh-btn.subtle:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
}

.list-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto 16px;
}

.list-meta {
  min-width: 0;
}

.list-count {
  font-size: 13px;
  color: rgba(180, 190, 210, 0.75);
  letter-spacing: 0.02em;
}

.owner {
  margin-left: 8px;
  color: rgba(90, 152, 200, 0.85);
}

.list-fetched {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(180, 190, 210, 0.55);
}

.feedback {
  width: 100%;
  max-width: 720px;
  margin: 0 auto 12px;
  font-size: 13px;
  line-height: 1.5;
}

.feedback.success {
  color: var(--accent);
}

.feedback.error {
  color: oklch(55% 0.15 25);
}

.author-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

@media (max-width: 720px) {
  .empty-card {
    padding: 40px 28px;
  }

  .list-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .refresh-btn.subtle {
    width: 100%;
  }
}
</style>
