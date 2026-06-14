<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { getPlanetTheme } from '../data/planetThemes'

const route = useRoute()

const isHome = computed(() => route.name === 'home')
const isQuoteModule = computed(() => route.name === 'dailyQuote')

const planetTheme = computed(() => {
  if (route.name === 'dailyQuote') {
    return getPlanetTheme('saturn')
  }
  return null
})

watch(
  planetTheme,
  (theme) => {
    const root = document.documentElement
    if (theme) {
      root.style.setProperty('--accent', theme.accent)
      root.style.setProperty('--accent-soft', theme.accentSoft)
      root.style.setProperty('--accent-glow', theme.glow)
    } else {
      root.style.removeProperty('--accent')
      root.style.removeProperty('--accent-soft')
      root.style.removeProperty('--accent-glow')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="app" :class="{ 'app-immersive': isHome || isQuoteModule, 'app-planet': isQuoteModule }">
    <AppSidebar v-if="!isHome && !isQuoteModule" />
    <main class="app-main" :class="{ 'quote-module': isQuoteModule, 'home-main': isHome }">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  background: var(--bg);
}

.app-immersive {
  display: block;
}

.app-immersive .home-main,
.app-immersive .quote-module {
  width: 100%;
  flex: none;
}

.app-planet .app-main {
  position: relative;
}
</style>
