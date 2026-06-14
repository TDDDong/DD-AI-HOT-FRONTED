<script setup lang="ts">
import { computed } from 'vue'
import type { PlanetId } from '../../data/planetThemes'
import { getPlanetImage } from '../../data/planetAssets'

const props = withDefaults(
  defineProps<{
    planetId: PlanetId
    size?: number
    showRings?: boolean
  }>(),
  {
    size: 180,
    showRings: undefined,
  },
)

const src = computed(() => getPlanetImage(props.planetId))
const hasRings = computed(() => props.showRings ?? props.planetId === 'saturn')
</script>

<template>
  <div
    class="photo-planet"
    :class="{ 'has-rings': hasRings }"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      class="planet-sphere"
      :src="src"
      :alt="planetId"
      :width="size"
      :height="size"
      draggable="false"
    />
  </div>
</template>

<style scoped>
.photo-planet {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  pointer-events: none;
}

.planet-sphere {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
  filter: drop-shadow(0 10px 28px rgba(0, 0, 0, 0.45));
  pointer-events: none;
  user-select: none;
}

.has-rings .planet-sphere {
  width: 78%;
  height: 78%;
}
</style>
