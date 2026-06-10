<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTopbar from '../components/AppTopbar.vue'
import { useQuotes } from '../composables/useQuotes'
import HistoryView from './HistoryView.vue'
import TodayView from './TodayView.vue'

type QuoteView = 'today' | 'history'

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
  <div class="daily-quote-shell">
    <AppTopbar :active-view="activeQuoteView" @switch-view="switchQuoteView" />

    <div class="quote-main">
      <section class="view" :class="{ active: activeQuoteView === 'today' }">
        <TodayView @go-history="switchQuoteView('history')" />
      </section>

      <section class="view" :class="{ active: activeQuoteView === 'history' }">
        <HistoryView />
      </section>
    </div>

    <footer class="app-footer">Daily Quote · 每日精选</footer>
  </div>
</template>
