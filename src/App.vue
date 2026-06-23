<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterView } from "vue-router";
import { AppSidebar } from "./components/sidebar";

const route = useRoute();
const isReader = computed(() => String(route.path).startsWith("/reader/"));
</script>

<template>
  <template v-if="isReader">
    <RouterView />
  </template>

  <div
    v-else
    class="flex h-screen min-w-screen bg-surface text-text-primary"
  >
    <AppSidebar />
    <main class="flex-1 overflow-y-auto scrollbar-ink">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>
