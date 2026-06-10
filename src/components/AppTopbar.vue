<script setup lang="ts">
defineProps<{
  activeView: 'today' | 'history'
}>()

const emit = defineEmits<{
  switchView: [view: 'today' | 'history']
}>()
</script>

<template>
  <header class="topbar">
    <div class="topbar-brand">
      <span class="topbar-dot"></span>
      每日短句精选
    </div>
    <nav class="topbar-nav" role="tablist">
      <button
        role="tab"
        :class="{ active: activeView === 'today' }"
        @click="emit('switchView', 'today')"
      >
        今日推荐
      </button>
      <button
        role="tab"
        :class="{ active: activeView === 'history' }"
        @click="emit('switchView', 'history')"
      >
        历史日推
      </button>
    </nav>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 0 20px 0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  background: oklch(98% 0.004 240 / 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fg);
}

.topbar-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

.topbar-nav {
  display: flex;
  gap: 4px;
  background: var(--surface);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 1px 4px oklch(0 0 0 / 0.04);
  border: 1px solid var(--border);
}

.topbar-nav button {
  padding: 8px 20px;
  border-radius: 999px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  transition: all 0.25s cubic-bezier(0.22, 0.61, 0.36, 1);
  white-space: nowrap;
}

.topbar-nav button.active {
  background: var(--fg);
  color: #fff;
  box-shadow: 0 2px 8px oklch(0 0 0 / 0.12);
}

.topbar-nav button:hover:not(.active) {
  color: var(--fg);
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
