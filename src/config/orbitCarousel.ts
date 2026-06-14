/**
 * 首页星环轮播 — 轨道几何与布局扩展点
 *
 * ## 如何新增模块
 * 1. 在 `src/data/appModules.ts` 的 `appModules` 数组末尾追加一项
 * 2. 在 `src/data/planetThemes.ts` / `planetAssets.ts` 注册对应 planetId 与图片
 * 3. 模块会自动均匀分布到椭圆轨道上，无需改轮播组件
 *
 * ## 可选微调
 * - 修改 `ORBIT_CAROUSEL_CONFIG` 调整椭圆大小、景深、动画基准
 * - 模块项上设置 `orbitAngleOffset`（弧度）可单独修正素材视觉中心
 */

export interface OrbitCarouselConfig {
  /** 椭圆水平半轴：相对轨道舞台「全宽」的百分比（星球中心落点） */
  rxPercent: number
  /** 椭圆垂直半轴：相对轨道舞台「全高」的百分比 */
  ryPercent: number
  /** 前景位角度（弧度），π/2 = 椭圆底部 */
  frontAngleRad: number
  /** 远景 / 前景缩放区间 */
  scaleMin: number
  scaleMax: number
  opacityMin: number
  opacityMax: number
  zIndexMin: number
  zIndexMax: number
  /** SVG 星环 viewBox，须与 `.orbit-stage` 宽高比一致 */
  viewBox: { width: number; height: number }
}

/** 默认椭圆轨道参数 — 修改此处即可全局调整星环形态 */
export const ORBIT_CAROUSEL_CONFIG: OrbitCarouselConfig = {
  rxPercent: 40,
  ryPercent: 22,
  frontAngleRad: Math.PI / 2,
  scaleMin: 0.36,
  scaleMax: 1,
  opacityMin: 0.38,
  opacityMax: 1,
  zIndexMin: 8,
  zIndexMax: 50,
  viewBox: { width: 1000, height: 480 },
}

export interface OrbitSlotLayout {
  /** 相对舞台左上角的百分比 left（星球中心） */
  leftPercent: number
  topPercent: number
  /** 相对舞台中心的偏移，便于调试 */
  offsetXPercent: number
  offsetYPercent: number
  angleRad: number
  scale: number
  opacity: number
  zIndex: number
  depth: number
}

export interface RingEllipseSvg {
  cx: number
  cy: number
  rx: number
  ry: number
  viewBox: string
}

function normalizeSlot(slot: number, total: number): number {
  if (total <= 0) return 0
  return ((slot % total) + total) % total
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t
}

/**
 * 计算模块在椭圆轨道上的落点。
 * @param relativeSlot 相对当前前景模块的槽位（0 = 前景）
 * @param total 模块总数（通常取 appModules.length）
 * @param angleOffsetRad 模块级角度微调（来自 AppModule.orbitAngleOffset）
 */
export function computeOrbitSlot(
  relativeSlot: number,
  total: number,
  angleOffsetRad = 0,
  config: OrbitCarouselConfig = ORBIT_CAROUSEL_CONFIG,
): OrbitSlotLayout {
  if (total <= 0) {
    return {
      leftPercent: 50,
      topPercent: 50,
      offsetXPercent: 0,
      offsetYPercent: 0,
      angleRad: config.frontAngleRad,
      scale: config.scaleMax,
      opacity: config.opacityMax,
      zIndex: config.zIndexMax,
      depth: 1,
    }
  }

  const slot = normalizeSlot(relativeSlot, total)
  const angleStep = (2 * Math.PI) / total
  const angleRad = config.frontAngleRad + slot * angleStep + angleOffsetRad

  const offsetXPercent = Math.cos(angleRad) * config.rxPercent
  const offsetYPercent = Math.sin(angleRad) * config.ryPercent

  // sin=1 → 前景（底部），sin=-1 → 远景（顶部）
  const depth = (Math.sin(angleRad) + 1) / 2

  return {
    leftPercent: 50 + offsetXPercent,
    topPercent: 50 + offsetYPercent,
    offsetXPercent,
    offsetYPercent,
    angleRad,
    scale: lerp(config.scaleMin, config.scaleMax, depth),
    opacity: lerp(config.opacityMin, config.opacityMax, depth),
    zIndex: Math.round(lerp(config.zIndexMin, config.zIndexMax, depth)),
    depth,
  }
}

/** 与 computeOrbitSlot 使用同一套参数的 SVG 椭圆（星环视觉轨道） */
export function getRingEllipseSvg(
  config: OrbitCarouselConfig = ORBIT_CAROUSEL_CONFIG,
): RingEllipseSvg {
  const { width, height } = config.viewBox
  const cx = width / 2
  const cy = height / 2
  return {
    cx,
    cy,
    rx: (config.rxPercent / 100) * width,
    ry: (config.ryPercent / 100) * height,
    viewBox: `0 0 ${width} ${height}`,
  }
}
