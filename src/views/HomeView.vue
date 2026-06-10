<script setup lang="ts">
import ModuleCard from '../components/ModuleCard.vue'
import { appModules } from '../data/appModules'
</script>

<template>
  <div class="page-shell home-view">
    <header class="page-header">
      <h1>DARVIS</h1>
      <p>你的个人 AI 助理。选择一个模块开始使用，更多模块即将上线。</p>
    </header>

    <div class="section-title">可用模块</div>
    <div class="module-grid">
      <ModuleCard v-for="module in appModules" :key="module.id" :module="module" />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.page-header p {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.5;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}

@media (max-width: 860px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
