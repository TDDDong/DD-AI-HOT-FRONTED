import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

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
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
})

export default router
