<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'

const route = useRoute()

const isQuoteModule = computed(() => route.name === 'dailyQuote')
</script>

<template>
  <div class="app">
    <AppSidebar />
    <main class="app-main" :class="{ 'quote-module': isQuoteModule }">
      <router-view />
    </main>
  </div>
</template>
