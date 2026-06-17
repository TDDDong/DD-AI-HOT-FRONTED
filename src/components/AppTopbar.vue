<script setup lang="ts">

import { RouterLink } from 'vue-router'



defineProps<{

  activeView: 'today' | 'history'

  planetName?: string

  todayLabel?: string

  historyLabel?: string

}>()



const emit = defineEmits<{

  switchView: [view: 'today' | 'history']

}>()

</script>



<template>

  <header class="topbar">

    <div class="topbar-left">

      <RouterLink class="topbar-brand" :to="{ name: 'home' }">DARVIS</RouterLink>

    </div>



    <div class="topbar-center">

      <h1 class="topbar-title">{{ planetName ?? '土星 · Saturn' }}</h1>

      <nav class="topbar-nav" role="tablist">

        <button

          role="tab"

          :class="{ active: activeView === 'today' }"

          @click="emit('switchView', 'today')"

        >

          {{ todayLabel ?? '今日推荐' }}

        </button>

        <button

          role="tab"

          :class="{ active: activeView === 'history' }"

          @click="emit('switchView', 'history')"

        >

          {{ historyLabel ?? '历史日推' }}

        </button>

      </nav>

    </div>



    <div class="topbar-right">

      <div class="topbar-actions" aria-hidden="true">

        <span class="action-dot" />

        <span class="action-dot" />

        <span class="action-avatar">Y</span>

      </div>

    </div>

  </header>

</template>



<style scoped>

.topbar {

  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  width: 100%;

  padding: 28px clamp(20px, 4vw, 48px) 24px;

}



.topbar-left {

  justify-self: start;

  min-width: 0;

}



.topbar-center {

  justify-self: center;

  text-align: center;

  min-width: 0;

}



.topbar-right {

  justify-self: end;

  min-width: 0;

}



.topbar-brand {

  font-size: 15px;

  font-weight: 600;

  letter-spacing: 0.18em;

  color: rgba(255, 255, 255, 0.92);

  text-decoration: none;

  transition: color 0.2s ease;

  white-space: nowrap;

}



.topbar-brand:hover {

  color: #fff;

}



.topbar-title {

  font-size: clamp(18px, 2.5vw, 22px);

  font-weight: 600;

  letter-spacing: 0.06em;

  color: #fff;

  margin-bottom: 16px;

}



.topbar-nav {

  display: inline-flex;

  gap: 28px;

}



.topbar-nav button {

  padding: 0 0 8px;

  border: none;

  border-bottom: 2px solid transparent;

  background: transparent;

  cursor: pointer;

  font-family: var(--font-body);

  font-size: 14px;

  font-weight: 500;

  color: rgba(210, 218, 230, 0.55);

  transition: color 0.25s cubic-bezier(0.32, 0.72, 0, 1);

  white-space: nowrap;

}



.topbar-nav button.active {

  color: #fff;

  border-bottom-color: var(--accent);

}



.topbar-nav button:hover:not(.active) {

  color: rgba(255, 255, 255, 0.8);

}



.topbar-actions {

  display: flex;

  justify-content: flex-end;

  align-items: center;

  gap: 12px;

}



.action-dot {

  width: 18px;

  height: 18px;

  border-radius: 4px;

  border: 1px solid rgba(255, 255, 255, 0.15);

  opacity: 0.5;

}



.action-avatar {

  width: 30px;

  height: 30px;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #0a0e18));

  color: #0a0e18;

  font-size: 12px;

  font-weight: 700;

  display: grid;

  place-items: center;

}



@media (max-width: 720px) {

  .topbar {

    grid-template-columns: 1fr;

    gap: 16px;

    padding-top: 20px;

  }



  .topbar-left,

  .topbar-center,

  .topbar-right {

    justify-self: center;

  }



  .topbar-right {

    display: none;

  }

}

</style>

