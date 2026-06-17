import type { PlanetId } from '../data/planetThemes'

export type AppRouteName = 'home' | 'dailyQuote' | 'aiHotNews'

export type AppModuleId = 'dailyQuote' | 'aiHotNews' | 'notes' | 'focusTimer' | 'dailyReflection'

export interface AppModule {
  id: AppModuleId
  title: string
  description: string
  planetId: PlanetId
  status: 'active' | 'comingSoon'
  route?: string
  /** 可选：修正星球素材视觉中心与椭圆轨道的偏差（弧度） */
  orbitAngleOffset?: number
}
