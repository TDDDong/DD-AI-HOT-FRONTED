import type { AppModule } from '../types/app'

/**
 * 首页星环模块列表 — 新增模块只需在此追加条目，
 * 轮播会自动按 appModules.length 均分椭圆轨道。
 */
export const appModules: AppModule[] = [
  {
    id: 'dailyQuote',
    title: '每日短句精选',
    description: '在浩瀚宇宙中，发现一句话的力量，点亮你的每一天。',
    planetId: 'saturn',
    status: 'active',
    route: '/daily-quote',
  },
  {
    id: 'aiHotNews',
    title: 'AI 热点新闻',
    description: '每日 AI 行业热点摘要，纵览前沿动态与技术风向标。',
    planetId: 'jupiter',
    status: 'active',
    route: '/ai-hot-news',
  },
  {
    id: 'notes',
    title: '笔记',
    description: '快速记录灵感和想法，支持 Markdown 编辑与标签分类。',
    planetId: 'mars',
    status: 'comingSoon',
  },
  {
    id: 'focusTimer',
    title: '专注计时',
    description: '番茄钟与深度工作计时器，追踪每日专注时长。',
    planetId: 'mars',
    status: 'comingSoon',
  },
  {
    id: 'dailyReflection',
    title: '每日反思',
    description: '引导式每日复盘，记录感恩、收获与改进方向。',
    planetId: 'neptune',
    status: 'comingSoon',
  },
]

export const availableModules = appModules.filter((module) => module.status === 'active')
