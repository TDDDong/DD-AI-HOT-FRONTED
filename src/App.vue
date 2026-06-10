<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import { useQuotes } from './composables/useQuotes'
import type { AppPage } from './types/app'
import HistoryView from './views/HistoryView.vue'
import HomeView from './views/HomeView.vue'
import TodayView from './views/TodayView.vue'

type QuoteView = 'today' | 'history'

const activePage = ref<AppPage>('home')
const activeQuoteView = ref<QuoteView>('today')
const { loadTodayQuote, loadHistory } = useQuotes()

async function navigate(page: AppPage): Promise<void> {
  activePage.value = page

  if (page === 'dailyQuote') {
    await loadTodayQuote()
    if (activeQuoteView.value === 'history') {
      await loadHistory(7)
    }
  }
}

async function switchQuoteView(view: QuoteView): Promise<void> {
  activeQuoteView.value = view
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
    <AppSidebar :active-page="activePage" @navigate="navigate" />

    <main class="app-main" :class="{ 'quote-module': activePage === 'dailyQuote' }">
      <HomeView v-if="activePage === 'home'" @open-daily-quote="navigate('dailyQuote')" />

      <div v-else class="daily-quote-shell">
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
    </main>
  </div>
</template>
