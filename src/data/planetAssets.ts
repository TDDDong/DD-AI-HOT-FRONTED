import type { PlanetId } from '../data/planetThemes'

export const planetImages: Record<PlanetId, string> = {
  saturn: '/assets/planets/saturn.png',
  mars: '/assets/planets/mars.png',
  jupiter: '/assets/planets/jupiter.png',
  neptune: '/assets/planets/neptune.png',
}

export function getPlanetImage(id: PlanetId): string {
  return planetImages[id]
}

/** 星球基准尺寸（透视由轨道 depth 缩放控制） */
export function getPlanetSize(id: PlanetId): number {
  const base: Record<PlanetId, number> = {
    saturn: 200,
    jupiter: 148,
    mars: 108,
    neptune: 118,
  }
  return base[id]
}

// 轨道布局见 src/config/orbitCarousel.ts
export {
  ORBIT_CAROUSEL_CONFIG,
  computeOrbitSlot,
  getRingEllipseSvg,
  type OrbitCarouselConfig,
  type OrbitSlotLayout,
  type RingEllipseSvg,
} from '../config/orbitCarousel'
