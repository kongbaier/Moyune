<script setup lang="ts">
import { RouterLink } from "vue-router";
import { type Component } from "vue";

defineProps<{
  item: {
    to: string;
    label: string;
    icon: Component;
  };
}>();
</script>

<template>
  <li>
    <RouterLink :to="item.to" v-slot="{ isActive }">
      <div
        class="group relative flex items-center px-3 py-2.5 transition-colors duration-300"
        :class="
          isActive
            ? 'text-accent-text'
            : 'text-text-muted hover:text-text-primary'
        "
      >
        <div
          v-if="isActive"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-accent"
        />
        <component :is="item.icon" class="size-3.5 shrink-0 mr-3" />
        <span>{{ item.label }}</span>
      </div>
    </RouterLink>
  </li>
</template>
