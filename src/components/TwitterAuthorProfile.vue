<script setup lang="ts">
import { computed } from 'vue'
import { formatCompactCount } from '../composables/useDate'
import type { TwitterFollowingItem, TwitterUser } from '../types/twitter'

const props = defineProps<{
  author: TwitterFollowingItem | TwitterUser | null
  handle: string
}>()

const screenName = computed(() => props.handle.replace(/^@/, ''))

const displayName = computed(() => props.author?.name ?? screenName.value)

const profileUrl = computed(() => `https://x.com/${screenName.value}`)

const avatarLetter = computed(() => displayName.value.charAt(0).toUpperCase())

const bioText = computed(() => {
  if (props.author?.bio) return props.author.bio
  if (props.author) return '暂无简介'
  return ' '
})

const statFollowing = computed(() =>
  props.author ? formatCompactCount(props.author.following) : '—',
)
const statFollowers = computed(() =>
  props.author ? formatCompactCount(props.author.followers) : '—',
)
const statTweets = computed(() => (props.author ? formatCompactCount(props.author.tweets) : '—'))
</script>

<template>
  <article class="profile-card">
    <div class="profile-banner" aria-hidden="true" />

    <div class="profile-body">
      <div class="profile-avatar" aria-hidden="true">{{ avatarLetter }}</div>

      <a
        class="profile-x-link"
        :href="profileUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        在 X 上查看
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>

      <div class="profile-identity">
        <div class="profile-name-row">
          <h2 class="profile-name">{{ displayName }}</h2>
          <span v-show="author?.verified" class="verified-badge" title="已认证">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
        </div>
        <p class="profile-handle">@{{ screenName }}</p>
      </div>

      <p class="profile-bio" :class="{ muted: !author?.bio }">{{ bioText }}</p>

      <div class="profile-stats">
        <span>
          <strong>{{ statFollowing }}</strong>
          正在关注
        </span>
        <span>
          <strong>{{ statFollowers }}</strong>
          粉丝
        </span>
        <span>
          <strong>{{ statTweets }}</strong>
          推文
        </span>
      </div>

      <a class="profile-link" :href="profileUrl" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        x.com/{{ screenName }}
      </a>
    </div>
  </article>
</template>

<style scoped>
.profile-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  padding: 0;
  background: rgba(12, 16, 26, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 80px rgba(0, 0, 0, 0.45);
  contain: layout style paint;
}

.profile-banner {
  height: 96px;
  background:
    linear-gradient(135deg, rgba(90, 152, 200, 0.28), rgba(12, 16, 28, 0.15)),
    radial-gradient(circle at 80% 20%, rgba(90, 152, 200, 0.22), transparent 55%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.profile-body {
  position: relative;
  padding: 0 28px 28px;
  min-height: 220px;
}

.profile-avatar {
  width: 84px;
  height: 84px;
  margin-top: -42px;
  margin-bottom: 14px;
  border-radius: 50%;
  border: 4px solid rgba(12, 16, 26, 0.85);
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #0a0e18));
  color: #0a0e18;
  font-size: 32px;
  font-weight: 700;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.profile-x-link {
  position: absolute;
  top: 16px;
  right: 28px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(8, 12, 22, 0.88);
  color: var(--fg);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s ease;
}

.profile-x-link:hover {
  border-color: rgba(255, 255, 255, 0.28);
}

.profile-x-link svg {
  width: 13px;
  height: 13px;
}

.profile-identity {
  margin-bottom: 12px;
  min-height: 52px;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-name {
  font-size: clamp(20px, 2.8vw, 24px);
  font-weight: 700;
  line-height: 1.25;
  color: #fff;
}

.verified-badge {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  color: var(--accent);
  flex-shrink: 0;
}

.verified-badge svg {
  width: 18px;
  height: 18px;
}

.profile-handle {
  margin-top: 4px;
  font-size: 14px;
  color: var(--muted);
}

.profile-bio {
  font-size: 15px;
  line-height: 1.65;
  color: rgba(232, 236, 244, 0.88);
  text-wrap: pretty;
  white-space: pre-wrap;
  margin-bottom: 16px;
  min-height: 48px;
}

.profile-bio.muted {
  color: rgba(180, 190, 210, 0.55);
}

.profile-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 14px;
  min-height: 22px;
  font-size: 14px;
  color: var(--muted);
}

.profile-stats strong {
  color: var(--fg);
  font-weight: 700;
  margin-right: 4px;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
}

.profile-link svg {
  width: 15px;
  height: 15px;
  opacity: 0.85;
}

.profile-link:hover {
  text-decoration: underline;
}

@media (max-width: 720px) {
  .profile-body {
    padding: 0 20px 24px;
  }

  .profile-x-link {
    right: 20px;
    padding: 7px 12px;
    font-size: 11px;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    margin-top: -36px;
    font-size: 28px;
  }
}
</style>
