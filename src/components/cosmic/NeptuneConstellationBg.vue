<script setup lang="ts">
/**
 * 海王星 + 星座双层背景
 * 底层：猎户 / 天狼 / 织女星座星空
 * 上层：海王星行星（screen 混合，黑色区域透出底层星图）
 */
</script>

<template>
  <div class="neptune-constellation-bg" aria-hidden="true">
    <div class="neptune-constellation-bg__stars" />
    <div class="neptune-constellation-bg__planet" />
    <div class="neptune-constellation-bg__overlay" />
  </div>
</template>

<style scoped>
.neptune-constellation-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background-color: #030508;
}

.neptune-constellation-bg__stars {
  position: absolute;
  inset: 0;
  background:
    url('/assets/constellation-starry-pure-bg.png') center / cover no-repeat;
  background-color: #030508;
}

.neptune-constellation-bg__planet {
  position: absolute;
  inset: 0;
  background:
    url('/assets/neptune-pure-bg.png') center 42% / cover no-repeat;
  mix-blend-mode: screen;
}

.neptune-constellation-bg__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to right,
      rgba(3, 5, 8, 0.35) 0%,
      rgba(3, 8, 18, 0.08) 42%,
      rgba(3, 8, 22, 0.04) 68%,
      rgba(3, 5, 8, 0.18) 100%
    ),
    linear-gradient(
      to bottom,
      rgba(3, 5, 8, 0.12) 0%,
      rgba(3, 8, 18, 0.04) 35%,
      rgba(3, 8, 22, 0.48) 72%,
      rgba(3, 5, 8, 0.9) 100%
    );
  pointer-events: none;
}

@media (prefers-reduced-transparency: reduce) {
  .neptune-constellation-bg__planet {
    mix-blend-mode: normal;
    opacity: 0.88;
  }

  .neptune-constellation-bg__overlay {
    background:
      linear-gradient(
        to bottom,
        rgba(3, 5, 8, 0.2) 0%,
        rgba(3, 8, 18, 0.12) 40%,
        rgba(3, 5, 8, 0.85) 100%
      );
  }
}
</style>
