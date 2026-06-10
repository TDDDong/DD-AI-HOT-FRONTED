<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModuleIcon from './ModuleIcon.vue'
import { availableModules } from '../data/appModules'
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
      <span class="sidebar-dot"></span>
      DARVIS
    </button>

    <nav class="sidebar-nav" aria-label="主导航">
      <button
        class="sidebar-link"
        :class="{ active: activeRouteName === 'home' }"
        type="button"
        @click="navigateHome"
      >
        <span class="nav-icon">
          <ModuleIcon name="dashboard" />
        </span>
        DARVIS
      </button>

      <div class="sidebar-section">模块</div>

      <button
        v-for="module in availableModules"
        :key="module.id"
        class="sidebar-link"
        :class="{ active: activeRouteName === module.id }"
        type="button"
        @click="navigateModule(module)"
      >
        <span class="nav-icon">
          <ModuleIcon :name="module.icon" />
        </span>
        {{ module.title }}
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
  min-height: 100vh;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fg);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  text-align: left;
}

.sidebar-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
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
  transition: all 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
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

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.nav-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.sidebar-section {
  padding: 20px 16px 8px 16px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
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
  background: linear-gradient(135deg, var(--accent), oklch(68% 0.12 140));
  color: #fff;
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
