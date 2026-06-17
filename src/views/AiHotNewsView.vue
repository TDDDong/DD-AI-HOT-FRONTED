<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../components/AppTopbar.vue'
import { useAiNews } from '../composables/useAiNews'
import AiHotNewsHistoryView from './AiHotNewsHistoryView.vue'
import AiHotNewsTodayView from './AiHotNewsTodayView.vue'

type NewsView = 'today' | 'history'

const router = useRouter()
const activeNewsView = ref<NewsView>('today')
const { loadToday, loadHistory } = useAiNews()

async function switchNewsView(view: NewsView): Promise<void> {
  activeNewsView.value = view
  if (view === 'history') {
    await loadHistory(7)
  }
}

onMounted(() => {
  loadToday()
})
</script>

<template>
  <div class="jupiter-module">
    <div class="jupiter-bg" aria-hidden="true" />
    <div class="jupiter-bg-overlay" aria-hidden="true" />

    <button class="back-home" type="button" aria-label="返回星图" @click="router.push({ name: 'home' })">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="quote-nav-shell">
      <AppTopbar
        :active-view="activeNewsView"
        planet-name="木星 · Jupiter"
        today-label="今日热点"
        history-label="历史热点"
        @switch-view="switchNewsView"
      />
    </div>

    <div class="quote-content-shell">
      <div class="quote-main">
        <section class="view" :class="{ active: activeNewsView === 'today' }">
          <AiHotNewsTodayView @go-history="switchNewsView('history')" />
        </section>

        <section class="view" :class="{ active: activeNewsView === 'history' }">
          <AiHotNewsHistoryView />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.jupiter-module {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.jupiter-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: #030508;
  background: url('/assets/jupiter-pure-bg.png') center 42% / cover no-repeat;
}

.jupiter-bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    rgba(3, 5, 8, 0.12) 0%,
    rgba(3, 5, 8, 0.04) 35%,
    rgba(3, 5, 8, 0.5) 72%,
    rgba(3, 5, 8, 0.92) 100%
  );
  pointer-events: none;
}

.back-home {
  display: none;
  position: fixed;
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
}

.back-home svg {
  width: 18px;
  height: 18px;
}
</style>
