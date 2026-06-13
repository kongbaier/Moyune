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
        class="flex items-center px-3 py-2 rounded-md transition-colors"
        :class="
          isActive
            ? 'bg-surface-active text-accent-text font-medium'
            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
        "
      >
        <component :is="item.icon" class="size-4 mr-3" />
        <span>{{ item.label }}</span>
      </div>
    </RouterLink>
  </li>
</template>
