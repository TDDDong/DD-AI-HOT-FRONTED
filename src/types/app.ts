export type AppPage = 'home' | 'dailyQuote'

export type AppModuleId = 'dailyQuote' | 'notes' | 'focusTimer' | 'dailyReflection'

export type ModuleIconName = 'dashboard' | 'book' | 'note' | 'clock' | 'reflection'

export interface AppModule {
  id: AppModuleId
  title: string
  description: string
  icon: ModuleIconName
  status: 'active' | 'comingSoon'
}
