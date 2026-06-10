export interface SentenceDto {
  content: string
  cn: string
}

export interface WordSentencesDto {
  word: string
  sentences: SentenceDto[]
}

export interface DailyHotSentencesDto {
  date: string
  words: WordSentencesDto[]
}

export interface PersistResultDto {
  saved: number
  skipped: number
  failed: number
}

export interface ApiErrorBody {
  error?: string
}
