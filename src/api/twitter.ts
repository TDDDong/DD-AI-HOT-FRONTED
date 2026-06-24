import { request } from './index'
import type {
  RefreshFollowingResult,
  SyncTwitterPostsResult,
  TwitterAuthorSyncState,
  TwitterFollowingList,
  TwitterPost,
} from '../types/twitter'

/** twitter-cli 拉取关注 / 同步推文可能较慢 */
const TWITTER_SLOW_TIMEOUT_MS = 300_000

function buildMaxQuery(max: number, ownerScreenName?: string): string {
  const qs = new URLSearchParams()
  if (max > 0) qs.set('max', String(max))
  if (ownerScreenName) qs.set('ownerScreenName', ownerScreenName)
  const query = qs.toString()
  return query ? `?${query}` : ''
}

/** 读库：关注列表 + 推文同步状态 */
export function listFollowingWithStatus(max = 0, ownerScreenName?: string): Promise<TwitterFollowingList> {
  return request<TwitterFollowingList>(
    `/api/v1/twitter/following-with-status${buildMaxQuery(max, ownerScreenName)}`,
  )
}

/** 从 X 拉取关注列表并落库，完成后需重新 listFollowingWithStatus */
export function refreshFollowing(max = 0, ownerScreenName?: string): Promise<RefreshFollowingResult> {
  return request<RefreshFollowingResult>(
    `/api/v1/twitter/following/refresh${buildMaxQuery(max, ownerScreenName)}`,
    {
      method: 'POST',
      timeoutMs: TWITTER_SLOW_TIMEOUT_MS,
    },
  )
}

export function listPosts(handle: string, limit = 50): Promise<TwitterPost[]> {
  const qs = new URLSearchParams({ handle, limit: String(limit) })
  return request<TwitterPost[]>(`/api/v1/twitter/posts/listAll?${qs}`)
}

export function getAuthorSyncState(handle: string): Promise<TwitterAuthorSyncState> {
  const qs = new URLSearchParams({ handle })
  return request<TwitterAuthorSyncState>(`/api/v1/twitter/author/sync-state?${qs}`)
}

/** 智能同步：首次 INITIAL，之后 INCREMENTAL（游标 = 最新落库时间） */
export function syncPosts(handle: string): Promise<SyncTwitterPostsResult> {
  const qs = new URLSearchParams({ handle })
  return request<SyncTwitterPostsResult>(`/api/v1/twitter/posts/sync?${qs}`, {
    method: 'POST',
    timeoutMs: TWITTER_SLOW_TIMEOUT_MS,
  })
}
