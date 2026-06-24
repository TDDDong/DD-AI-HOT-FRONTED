<script setup lang="ts">
defineOptions({ name: 'TwitterFeedView' })

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NeptuneConstellationBg from '../components/cosmic/NeptuneConstellationBg.vue'

const route = useRoute()
const router = useRouter()

const isDetail = computed(() => route.name === 'twitterAuthor')
</script>

<template>
  <div class="neptune-module">
    <NeptuneConstellationBg />

    <button class="back-home" type="button" aria-label="返回星图" @click="router.push({ name: 'home' })">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="quote-nav-shell">
      <header class="module-header">
        <p class="module-planet">海王星 · Neptune</p>
        <h1 class="module-title">{{ isDetail ? '博主推文' : 'Twitter 星空' }}</h1>
        <p class="module-subtitle" :class="{ 'module-subtitle--placeholder': isDetail }">
          {{ isDetail ? '\u00A0' : '在猎户与天狼之间，阅读关注博主的推文' }}
        </p>
      </header>
    </div>

    <div class="quote-content-shell">
      <div class="quote-main">
        <router-view />
      </div>
    </div>
  </div>
</template>
<style scoped>
.neptune-module {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.module-header {
  padding: 28px 40px 0;
  text-align: center;
}

.module-planet {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(90, 152, 200, 0.75);
  margin-bottom: 10px;
}

.module-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #e8ecf4;
}

.module-subtitle {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(180, 190, 210, 0.55);
  letter-spacing: 0.04em;
  min-height: 1.4em;
}

.module-subtitle--placeholder {
  visibility: hidden;
}

.back-home {
  display: none;  position: fixed;
  top: 20px;
  left: 16px;
  z-index: calc(var(--z-nav) + 1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(8, 12, 22, 0.5);
  color: #fff;
  cursor: pointer;
  place-items: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@media (max-width: 720px) {
  .back-home {
    display: grid;
  }

  .module-header {
    padding: 20px 20px 0;
  }
}

.back-home svg {
  width: 18px;
  height: 18px;
}
</style>
