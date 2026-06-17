<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import { getPlanetTheme } from '../data/planetThemes'
import type { AppRouteName } from '../types/app'
import type { PlanetId } from '../data/planetThemes'

const PLANET_MODULES: Partial<Record<AppRouteName, PlanetId>> = {
  dailyQuote: 'saturn',
  aiHotNews: 'jupiter',
}

const route = useRoute()

const isHome = computed(() => route.name === 'home')
const isPlanetModule = computed(() => {
  const name = route.name as AppRouteName
  return name in PLANET_MODULES
})

const planetTheme = computed(() => {
  const name = route.name as AppRouteName
  const planetId = PLANET_MODULES[name]
  return planetId ? getPlanetTheme(planetId) : null
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
  <div class="app" :class="{ 'app-immersive': isHome || isPlanetModule, 'app-planet': isPlanetModule }">
    <AppSidebar v-if="!isHome && !isPlanetModule" />
    <main class="app-main" :class="{ 'quote-module': isPlanetModule, 'home-main': isHome }">
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
