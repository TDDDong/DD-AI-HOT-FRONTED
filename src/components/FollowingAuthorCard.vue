<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatApiDateTime, formatCompactCount } from '../composables/useDate'
import type { TwitterFollowingItem } from '../types/twitter'

defineProps<{
  author: TwitterFollowingItem
}>()
</script>

<template>
  <article class="author-card glass-panel">
    <div class="author-head">
      <div class="author-avatar" aria-hidden="true">{{ author.name.charAt(0) }}</div>
      <div class="author-meta">
        <div class="author-name-row">
          <h2 class="author-name">{{ author.name }}</h2>
          <span v-if="author.verified" class="verified-badge" title="已认证">✓</span>
        </div>
        <p class="author-handle">@{{ author.screenName }}</p>
      </div>
    </div>

    <p v-if="author.bio" class="author-bio">{{ author.bio }}</p>

    <div class="author-stats">
      <span>{{ formatCompactCount(author.followers) }} 粉丝</span>
      <span>{{ formatCompactCount(author.following) }} 关注</span>
      <span>{{ formatCompactCount(author.tweets) }} 推文</span>
    </div>

    <div class="author-sync">
      <template v-if="author.synced">
        <span class="sync-label synced">已同步 · {{ author.postCount }} 条落库</span>
        <span v-if="author.lastFetchedAt" class="sync-time">
          上次 {{ formatApiDateTime(author.lastFetchedAt) }}
        </span>
      </template>
      <span v-else class="sync-label unsynced">未同步</span>
    </div>

    <RouterLink
      class="detail-btn"
      :to="{
        name: 'twitterAuthor',
        params: { handle: author.screenName },
        state: { author },
      }"
    >
      查看推文
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </RouterLink>
  </article>
</template>

<style scoped>
.author-card {
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.author-card:hover {
  transform: translateY(-2px);
}

.author-head {
  display: flex;
  gap: 14px;
  align-items: center;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #0a0e18));
  color: #0a0e18;
  font-size: 18px;
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.author-meta {
  min-width: 0;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--fg);
  line-height: 1.3;
}

.verified-badge {
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-soft);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.author-handle {
  font-size: 13px;
  color: var(--muted);
  margin-top: 2px;
}

.author-bio {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(210, 218, 230, 0.78);
  text-wrap: pretty;
}

.author-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: rgba(180, 190, 210, 0.65);
  letter-spacing: 0.02em;
}

.author-sync {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.sync-label.synced {
  color: var(--accent);
  font-weight: 600;
}

.sync-label.unsynced {
  color: rgba(210, 218, 230, 0.55);
}

.sync-time {
  color: rgba(180, 190, 210, 0.55);
}

.detail-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  padding: 10px 20px;
  border-radius: 999px;
  background: var(--accent);
  color: #0a0e18;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 16px var(--accent-glow);
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.detail-btn:hover {
  box-shadow: 0 4px 20px var(--accent-glow);
}

.detail-btn svg {
  width: 14px;
  height: 14px;
}

.detail-btn:active {
  transform: scale(0.97);
}
</style>
