<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PlanetRingCarousel from '../components/cosmic/PlanetRingCarousel.vue'
</script>

<template>
  <div class="cosmic-home">
    <div class="cosmic-home-bg" aria-hidden="true" />

    <header class="cosmic-topbar">
      <RouterLink class="brand" :to="{ name: 'home' }">
        <span class="brand-name">DARVIS</span>
        <span class="brand-sub">个人智能助手</span>
      </RouterLink>
      <button class="menu-btn" type="button" aria-label="菜单">
        <span />
        <span />
        <span />
      </button>
    </header>

    <PlanetRingCarousel />
  </div>
</template>

<style scoped>
.cosmic-home {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cosmic-home-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(8, 14, 28, 0.15), rgba(3, 5, 8, 0.72)),
    url('/assets/home-starfield-bg.png') center / cover no-repeat;
  background-color: #030508;
}

.cosmic-topbar {
  position: relative;
  z-index: var(--z-content);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 40px 0;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #fff;
}

.brand-sub {
  font-size: 13px;
  font-weight: 400;
  color: rgba(210, 218, 230, 0.65);
  letter-spacing: 0.06em;
}

.menu-btn {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: rgba(255, 255, 255, 0.75);
}

@media (max-width: 860px) {
  .cosmic-topbar {
    padding: 20px 20px 0;
  }

  .brand-sub {
    display: none;
  }
}
</style>
