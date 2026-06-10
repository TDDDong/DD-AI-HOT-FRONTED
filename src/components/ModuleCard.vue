<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ModuleIcon from './ModuleIcon.vue'
import type { AppModule } from '../types/app'

defineProps<{
  module: AppModule
}>()
</script>

<template>
  <RouterLink
    v-if="module.status === 'active' && module.route"
    :to="module.route"
    class="module-card"
  >
    <div class="module-icon quote">
      <ModuleIcon :name="module.icon" />
    </div>

    <h3>{{ module.title }}</h3>
    <p>{{ module.description }}</p>

    <div class="module-actions">
      <span class="module-btn">
        进入模块
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
    </div>
  </RouterLink>

  <div v-else class="module-card disabled">
    <div class="module-icon placeholder">
      <ModuleIcon :name="module.icon" />
    </div>

    <h3>{{ module.title }}</h3>
    <p>{{ module.description }}</p>

    <div class="module-actions">
      <span class="coming-badge">即将上线</span>
    </div>
  </div>
</template>

<style scoped>
.module-card {
  background: var(--surface);
  border: none;
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow:
    0 2px 16px oklch(0 0 0 / 0.04),
    0 1px 2px oklch(0 0 0 / 0.02);
  transition:
    transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  text-align: left;
  font-family: var(--font-body);
}

.module-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 12px 40px oklch(0 0 0 / 0.08),
    0 2px 4px oklch(0 0 0 / 0.03);
}

.module-card:active {
  transform: scale(0.985);
}

.module-card.disabled {
  cursor: default;
}

.module-card.disabled:hover {
  transform: none;
  box-shadow:
    0 2px 16px oklch(0 0 0 / 0.04),
    0 1px 2px oklch(0 0 0 / 0.02);
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), oklch(68% 0.12 140));
}

.module-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  margin-bottom: 20px;
}

.module-icon.quote {
  background: linear-gradient(135deg, oklch(56% 0.12 170 / 0.15), oklch(68% 0.12 140 / 0.1));
  color: var(--accent);
}

.module-icon.placeholder {
  background: oklch(90% 0.005 240);
  color: oklch(60% 0.01 240);
}

.module-icon :deep(svg) {
  width: 26px;
  height: 26px;
}

.module-card h3 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}

.module-card p {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.55;
  margin-bottom: 24px;
  flex: 1;
}

.module-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border-radius: 999px;
  background: var(--accent-soft);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.02em;
  transition:
    background 0.2s,
    transform 0.2s;
  text-decoration: none;
}

.module-card:hover .module-btn {
  background: oklch(56% 0.12 170 / 0.14);
}

.module-btn svg {
  width: 14px;
  height: 14px;
}

.coming-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: oklch(90% 0.005 240);
  color: oklch(55% 0.015 240);
  text-transform: uppercase;
}
</style>
