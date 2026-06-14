<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhotoPlanet from './cosmic/PhotoPlanet.vue'
import { availableModules } from '../data/appModules'
import { getPlanetTheme } from '../data/planetThemes'
import type { AppModule } from '../types/app'

const route = useRoute()
const router = useRouter()

const activeRouteName = computed(() => route.name)

function navigateHome(): void {
  router.push({ name: 'home' })
}

function navigateModule(module: AppModule): void {
  if (module.route) {
    router.push(module.route)
  }
}
</script>

<template>
  <aside class="sidebar">
    <button class="sidebar-brand" type="button" @click="navigateHome">
      <span class="sidebar-dot" />
      DARVIS
    </button>

    <nav class="sidebar-nav" aria-label="主导航">
      <button
        class="sidebar-link"
        :class="{ active: activeRouteName === 'home' }"
        type="button"
        @click="navigateHome"
      >
        星图首页
      </button>

      <div class="sidebar-section">行星模块</div>

      <button
        v-for="module in availableModules"
        :key="module.id"
        class="sidebar-link module-link"
        :class="{ active: activeRouteName === module.id }"
        type="button"
        @click="navigateModule(module)"
      >
        <PhotoPlanet
          :planet-id="module.planetId"
          :size="28"
        />
        <span class="link-text">
          <span class="link-planet">{{ getPlanetTheme(module.planetId).nameZh }}</span>
          {{ module.title }}
        </span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user">
        <div class="avatar">Y</div>
        <span>You</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100dvh;
  flex-shrink: 0;
  background: rgba(8, 12, 22, 0.75);
  border-right: 1px solid var(--border);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  position: sticky;
  top: 0;
  height: 100dvh;
  z-index: var(--z-nav);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fg);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  text-align: left;
}

.sidebar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px var(--accent-glow);
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.sidebar-link:hover {
  background: var(--accent-soft);
  color: var(--fg);
}

.sidebar-link.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}

.module-link {
  padding: 10px 12px;
}

.link-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.3;
}

.link-planet {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.sidebar-section {
  padding: 20px 16px 8px 16px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar-footer {
  border-top: 1px solid var(--border);
  padding-top: 20px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--fg);
  font-size: 13px;
  font-weight: 500;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), rgba(255, 255, 255, 0.15));
  color: #0a0e18;
  display: grid;
  font-size: 14px;
  font-weight: 700;
  place-items: center;
}

@media (max-width: 860px) {
  .sidebar {
    display: none;
  }
}
</style>
