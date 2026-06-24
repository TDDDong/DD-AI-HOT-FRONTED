import { findFollowingAuthor } from './useTwitterFeed'
import type { TwitterFollowingItem } from '../types/twitter'

/** 同步解析博主资料：路由 state → 关注列表缓存 */
export function resolveTwitterAuthorSeed(handle: string): TwitterFollowingItem | undefined {
  const normalized = handle.replace(/^@/, '').toLowerCase()

  const state = history.state as { author?: TwitterFollowingItem } | null
  if (state?.author) {
    const stateHandle = state.author.screenName.replace(/^@/, '').toLowerCase()
    if (stateHandle === normalized) {
      return state.author
    }
  }

  return findFollowingAuthor(handle)
}
