<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTopbar from '../components/AppTopbar.vue'
import { useQuotes } from '../composables/useQuotes'
import HistoryView from './HistoryView.vue'
import TodayView from './TodayView.vue'

type QuoteView = 'today' | 'history'

const router = useRouter()
const activeQuoteView = ref<QuoteView>('today')
const { loadToday, loadHistory } = useQuotes()

async function switchQuoteView(view: QuoteView): Promise<void> {
  activeQuoteView.value = view
  if (view === 'history') {
    await loadHistory(7)
  }
}

onMounted(() => {
  loadToday()
})
</script>

<template>
  <div class="saturn-module">
    <div class="saturn-bg" aria-hidden="true" />
    <div class="saturn-bg-overlay" aria-hidden="true" />

    <button class="back-home" type="button" aria-label="返回星图" @click="router.push({ name: 'home' })">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="quote-nav-shell">
      <AppTopbar :active-view="activeQuoteView" planet-name="土星 · Saturn" @switch-view="switchQuoteView" />
    </div>

    <div class="quote-content-shell">
      <div class="quote-main">
        <section class="view" :class="{ active: activeQuoteView === 'today' }">
          <TodayView @go-history="switchQuoteView('history')" />
        </section>

        <section class="view" :class="{ active: activeQuoteView === 'history' }">
          <HistoryView />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.saturn-module {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.saturn-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-color: #030508;
  background: url('/assets/saturn-pure-bg.png') center 42% / cover no-repeat;
}

.saturn-bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    rgba(3, 5, 8, 0.15) 0%,
    rgba(3, 5, 8, 0.05) 35%,
    rgba(3, 5, 8, 0.55) 72%,
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
