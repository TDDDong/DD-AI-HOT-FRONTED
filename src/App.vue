<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTopbar from './components/AppTopbar.vue'
import { useQuotes } from './composables/useQuotes'
import HistoryView from './views/HistoryView.vue'
import TodayView from './views/TodayView.vue'

const activeView = ref<'today' | 'history'>('today')
const { loadTodayQuote, loadHistory } = useQuotes()

async function switchView(view: 'today' | 'history'): Promise<void> {
  activeView.value = view
  if (view === 'history') {
    await loadHistory(7)
  }
}

onMounted(() => {
  loadTodayQuote()
})
</script>

<template>
  <div class="app">
    <AppTopbar :active-view="activeView" @switch-view="switchView" />

    <main class="main">
      <section class="view" :class="{ active: activeView === 'today' }">
        <TodayView @go-history="switchView('history')" />
      </section>

      <section class="view" :class="{ active: activeView === 'history' }">
        <HistoryView />
      </section>
    </main>

    <footer class="app-footer">Daily Quote · 每日精选</footer>
  </div>
</template>
