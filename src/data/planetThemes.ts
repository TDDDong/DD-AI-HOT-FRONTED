export type PlanetId = 'saturn' | 'mars' | 'jupiter' | 'neptune'

export interface PlanetTheme {
  id: PlanetId
  name: string
  nameZh: string
  accent: string
  accentSoft: string
  glow: string
}

export const planetThemes: Record<PlanetId, PlanetTheme> = {
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    nameZh: '土星',
    accent: '#d4c4a8',
    accentSoft: 'rgba(212, 196, 168, 0.12)',
    glow: 'rgba(212, 196, 168, 0.35)',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    nameZh: '火星',
    accent: '#c96a52',
    accentSoft: 'rgba(201, 106, 82, 0.12)',
    glow: 'rgba(201, 106, 82, 0.3)',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    nameZh: '木星',
    accent: '#b89068',
    accentSoft: 'rgba(184, 144, 104, 0.12)',
    glow: 'rgba(184, 144, 104, 0.28)',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    nameZh: '海王星',
    accent: '#5a98c8',
    accentSoft: 'rgba(90, 152, 200, 0.12)',
    glow: 'rgba(90, 152, 200, 0.32)',
  },
}

export function getPlanetTheme(id: PlanetId): PlanetTheme {
  return planetThemes[id]
}
