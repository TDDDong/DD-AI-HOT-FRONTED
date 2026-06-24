<script setup lang="ts">
import { formatApiDateTime, formatCompactCount } from '../composables/useDate'
import type { TwitterPost } from '../types/twitter'

defineProps<{
  post: TwitterPost
}>()
</script>

<template>
  <article class="tweet-card glass-panel">
    <div class="tweet-head">
      <time class="tweet-time" :datetime="post.createdAt">{{ formatApiDateTime(post.createdAt) }}</time>
      <span v-if="post.retweet" class="retweet-badge">转推</span>
    </div>

    <p class="tweet-text">{{ post.text }}</p>

    <div v-if="post.mediaUrls.length" class="tweet-media">
      <a
        v-for="(mediaUrl, index) in post.mediaUrls"
        :key="`${post.tweetId}-media-${index}`"
        class="media-link"
        :href="mediaUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        媒体 {{ index + 1 }}
      </a>
    </div>

    <div class="tweet-metrics">
      <span>{{ formatCompactCount(post.replyCount) }} 回复</span>
      <span>{{ formatCompactCount(post.retweetCount) }} 转推</span>
      <span>{{ formatCompactCount(post.likeCount) }} 喜欢</span>
      <span v-if="post.viewCount > 0">{{ formatCompactCount(post.viewCount) }} 浏览</span>
    </div>

    <a class="tweet-link" :href="post.url" target="_blank" rel="noopener noreferrer">
      在 X 上查看
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  </article>
</template>

<style scoped>
.tweet-card {
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  position: relative;
}

.tweet-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.tweet-time {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.retweet-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 3px 10px;
  border-radius: 999px;
}

.tweet-text {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(232, 236, 244, 0.92);
  text-wrap: pretty;
  white-space: pre-wrap;
  margin-bottom: 16px;
}

.tweet-media {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.media-link {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.tweet-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12px;
  color: rgba(180, 190, 210, 0.65);
  margin-bottom: 14px;
}

.tweet-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.tweet-link:hover {
  opacity: 1;
}

.tweet-link svg {
  width: 13px;
  height: 13px;
}
</style>
