import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import TwitterFeedView from '../views/TwitterFeedView.vue'
import TwitterFollowingView from '../views/TwitterFollowingView.vue'
import TwitterAuthorDetailView from '../views/TwitterAuthorDetailView.vue'
import { resolveTwitterAuthorSeed } from '../composables/twitterAuthorSeed'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'daily-quote',
          name: 'dailyQuote',
          component: () => import('../views/DailyQuoteView.vue'),
        },
        {
          path: 'ai-hot-news',
          name: 'aiHotNews',
          component: () => import('../views/AiHotNewsView.vue'),
        },
        {
          path: 'twitter-feed',
          component: TwitterFeedView,
          children: [
            {
              path: '',
              name: 'twitterFeed',
              component: TwitterFollowingView,
            },
            {
              path: ':handle',
              name: 'twitterAuthor',
              component: TwitterAuthorDetailView,
              props: (route) => {
                const handle = String(route.params.handle).replace(/^@/, '')
                return {
                  handle,
                  seedAuthor: resolveTwitterAuthorSeed(handle),
                }
              },
            },          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
})

export default router
