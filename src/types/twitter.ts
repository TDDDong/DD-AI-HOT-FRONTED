export interface TwitterUser {
  id: string
  name: string
  screenName: string
  bio: string
  followers: number
  following: number
  tweets: number
  verified: boolean
}

export interface TwitterFollowingItem extends TwitterUser {
  synced: boolean
  lastFetchedAt: string | null
  postCount: number
}

export interface TwitterFollowingList {
  ownerScreenName: string | null
  listFetchedAt: string | null
  total: number
  items: TwitterFollowingItem[]
}

export interface RefreshFollowingResult {
  ownerScreenName: string
  listFetchedAt: string
  inserted: number
  updated: number
  removed: number
  total: number
}

export interface TwitterAuthorSyncState {
  handle: string
  synced: boolean
  lastFetchedAt: string | null
  postCount: number
}

export interface TwitterPost {
  articleId: string
  id: number
  handle: string
  tweetId: string
  date: string
  rankNo: number
  title: string
  text: string
  url: string
  likeCount: number
  retweetCount: number
  replyCount: number
  viewCount: number
  retweet: boolean
  mediaUrls: string[]
  urls: string[]
  createdAt: string
  sourceType: string
}

export interface SyncTwitterPostsResult {
  handle: string
  syncMode: 'INITIAL' | 'INCREMENTAL'
  cursorUsed: string | null
  fetchDate: string
  digestId: number | null
  insertedArticles: number
  updatedArticles: number
  skippedArticles: number
  fetchedCount: number
  persistedCount: number
}

export interface ApiErrorBody {
  error?: string
}
