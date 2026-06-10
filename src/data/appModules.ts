import type { AppModule } from '../types/app'

export const appModules: AppModule[] = [
  {
    id: 'dailyQuote',
    title: '每日短句精选',
    description: '每日推荐一句精选英语短句，提供中文翻译，支持浏览历史日推。为日常自我提升而设计。',
    icon: 'book',
    status: 'active',
  },
  {
    id: 'notes',
    title: '笔记',
    description: '快速记录灵感和想法，支持 Markdown 编辑与标签分类。',
    icon: 'note',
    status: 'comingSoon',
  },
  {
    id: 'focusTimer',
    title: '专注计时',
    description: '番茄钟与深度工作计时器，追踪每日专注时长。',
    icon: 'clock',
    status: 'comingSoon',
  },
  {
    id: 'dailyReflection',
    title: '每日反思',
    description: '引导式每日复盘，记录感恩、收获与改进方向。',
    icon: 'reflection',
    status: 'comingSoon',
  },
]

export const availableModules = appModules.filter((module) => module.status === 'active')
