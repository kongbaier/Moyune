<script setup lang="ts">
import { RouterView } from "vue-router";
import { AppSidebar } from "./components/sidebar";
</script>

<template>
  <div
    class="flex h-screen min-w-screen bg-surface text-text-primary theme-transition"
  >
    <AppSidebar />
    <main class="flex-1 overflow-y-auto scrollbar-thin scrollbar-gutter-both">
      <RouterView />
    </main>
  </div>
</template>
