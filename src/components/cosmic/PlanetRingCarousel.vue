<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PhotoPlanet from './PhotoPlanet.vue'
import { computeOrbitSlot, getPlanetSize, getRingEllipseSvg } from '../../data/planetAssets'
import { appModules } from '../../data/appModules'
import { getPlanetTheme } from '../../data/planetThemes'

const AUTO_MS = 5000
const SWIPE_THRESHOLD = 48

const activeIndex = ref(0)
const pauseAuto = ref(false)

const count = appModules.length

const activeModule = computed(() => appModules[activeIndex.value])
const canEnter = computed(
  () => activeModule.value.status === 'active' && !!activeModule.value.route,
)

const ringEllipse = computed(() => getRingEllipseSvg())

let autoTimer: ReturnType<typeof setInterval> | null = null
let pauseTimer: ReturnType<typeof setTimeout> | null = null
let touchStartX = 0

function normalizeIndex(index: number): number {
  return ((index % count) + count) % count
}

function goTo(index: number): void {
  activeIndex.value = normalizeIndex(index)
  pauseAutoBriefly()
}

function next(): void {
  goTo(activeIndex.value + 1)
}

function prev(): void {
  goTo(activeIndex.value - 1)
}

function pauseAutoBriefly(): void {
  pauseAuto.value = true
  if (pauseTimer) clearTimeout(pauseTimer)
  pauseTimer = setTimeout(() => {
    pauseAuto.value = false
  }, AUTO_MS * 2)
}

function startAuto(): void {
  if (autoTimer) clearInterval(autoTimer)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return
  autoTimer = setInterval(() => {
    if (!pauseAuto.value) next()
  }, AUTO_MS)
}

function planetStyle(index: number): Record<string, string | number> {
  const relative = normalizeIndex(index - activeIndex.value)
  const module = appModules[index]
  const slot = computeOrbitSlot(relative, count, module.orbitAngleOffset ?? 0)
  return {
    left: `${slot.leftPercent}%`,
    top: `${slot.topPercent}%`,
    '--orbit-scale': slot.scale,
    '--orbit-opacity': slot.opacity,
    zIndex: slot.zIndex,
  }
}

function isFront(index: number): boolean {
  return normalizeIndex(index - activeIndex.value) === 0
}

function onTouchStart(e: TouchEvent): void {
  touchStartX = e.touches[0].clientX
  pauseAutoBriefly()
}

function onTouchEnd(e: TouchEvent): void {
  const delta = e.changedTouches[0].clientX - touchStartX
  if (delta > SWIPE_THRESHOLD) prev()
  else if (delta < -SWIPE_THRESHOLD) next()
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

onMounted(() => {
  startAuto()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (pauseTimer) clearTimeout(pauseTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="planet-carousel"
    @mouseenter="pauseAuto = true"
    @mouseleave="pauseAuto = false"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <button class="carousel-chevron prev" type="button" aria-label="上一个星球" @click="prev">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div class="orbit-stage">
      <svg class="orbit-ring" :viewBox="ringEllipse.viewBox" aria-hidden="true">
        <defs>
          <linearGradient id="orbit-ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.04)" />
            <stop offset="25%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="50%" stop-color="rgba(255,255,255,0.38)" />
            <stop offset="75%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>
        <ellipse
          :cx="ringEllipse.cx"
          :cy="ringEllipse.cy"
          :rx="ringEllipse.rx"
          :ry="ringEllipse.ry"
          class="orbit-track orbit-track-glow"
        />
        <ellipse
          :cx="ringEllipse.cx"
          :cy="ringEllipse.cy"
          :rx="ringEllipse.rx"
          :ry="ringEllipse.ry"
          class="orbit-track orbit-track-main"
        />
      </svg>

      <div
        v-for="(module, index) in appModules"
        :key="module.id"
        class="orbit-item"
        :class="{ front: isFront(index), locked: module.status !== 'active' }"
        :style="planetStyle(index)"
      >
        <PhotoPlanet
          :planet-id="module.planetId"
          :size="getPlanetSize(module.planetId)"
        />
      </div>
    </div>

    <button class="carousel-chevron next" type="button" aria-label="下一个星球" @click="next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div :key="activeIndex" class="carousel-info">
      <h2>{{ activeModule.title }}</h2>
      <p class="carousel-desc">{{ activeModule.description }}</p>

      <RouterLink v-if="canEnter" :to="activeModule.route!" class="carousel-cta">
        进入星球
      </RouterLink>
      <span v-else class="carousel-locked">即将上线</span>

      <div class="carousel-dots" role="tablist" aria-label="选择星球">
        <button
          v-for="(module, index) in appModules"
          :key="module.id"
          type="button"
          role="tab"
          :aria-selected="index === activeIndex"
          :aria-label="getPlanetTheme(module.planetId).nameZh"
          :class="{ active: index === activeIndex }"
          @click="goTo(index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.planet-carousel {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: min(78dvh, 760px);
  user-select: none;
}

.orbit-stage {
  position: relative;
  width: min(1020px, 94vw);
  aspect-ratio: 1000 / 480;
  margin: 0 auto;
}

.orbit-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.orbit-track {
  fill: none;
  transform-origin: center;
}

.orbit-track-glow {
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 14;
  filter: blur(6px);
}

.orbit-track-main {
  stroke: url(#orbit-ring-gradient);
  stroke-width: 1.5;
  stroke-dasharray: 3 14;
  opacity: 0.85;
}

.orbit-item {
  position: absolute;
  transform: translate(-50%, -50%) scale(var(--orbit-scale, 1));
  opacity: var(--orbit-opacity, 1);
  transition:
    left 0.95s cubic-bezier(0.32, 0.72, 0, 1),
    top 0.95s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.95s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.95s cubic-bezier(0.32, 0.72, 0, 1),
    filter 0.95s cubic-bezier(0.32, 0.72, 0, 1);
  will-change: left, top, transform, opacity;
}

.orbit-item.front {
  opacity: 1;
  filter: none;
}

.orbit-item.locked:not(.front) {
  filter: saturate(0.55) brightness(0.72);
}

.carousel-chevron {
  position: absolute;
  top: 42%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: color 0.25s cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 60;
}

.carousel-chevron svg {
  width: 28px;
  height: 28px;
}

.carousel-chevron:hover {
  color: rgba(255, 255, 255, 0.95);
}

.carousel-chevron.prev {
  left: max(12px, calc(50% - 540px));
}

.carousel-chevron.next {
  right: max(12px, calc(50% - 540px));
}

.carousel-info {
  text-align: center;
  max-width: 520px;
  padding: 12px 24px 0;
  animation: info-fade 0.55s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes info-fade {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-info h2 {
  font-size: clamp(22px, 3.2vw, 30px);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
  color: #fff;
  text-wrap: balance;
}

.carousel-desc {
  font-size: 14px;
  line-height: 1.75;
  color: rgba(210, 218, 230, 0.78);
  margin-bottom: 24px;
  text-wrap: pretty;
}

.carousel-cta {
  display: inline-flex;
  padding: 10px 32px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: transparent;
  text-decoration: none;
  transition:
    background 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    border-color 0.25s cubic-bezier(0.32, 0.72, 0, 1),
    transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
}

.carousel-cta:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.85);
}

.carousel-cta:active {
  transform: scale(0.97);
}

.carousel-locked {
  display: inline-flex;
  padding: 8px 22px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: rgba(180, 190, 210, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
}

.carousel-dots button {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  border: none;
  padding: 0;
  background: rgba(255, 255, 255, 0.28);
  cursor: pointer;
  transition:
    width 0.3s cubic-bezier(0.32, 0.72, 0, 1),
    background 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.carousel-dots button.active {
  width: 22px;
  background: rgba(255, 255, 255, 0.88);
}

@media (max-width: 860px) {
  .orbit-stage {
    width: min(920px, 96vw);
  }

  .carousel-chevron.prev {
    left: 4px;
  }

  .carousel-chevron.next {
    right: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-item,
  .carousel-info {
    transition: none;
    animation: none;
  }
}
</style>
