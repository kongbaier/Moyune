<script setup lang="ts">
import { List, SlidersHorizontal, Type } from "@lucide/vue";

defineProps<{
  show: boolean;
  fontScaleLabel: string;
}>();

const emit = defineEmits<{
  toggleDrawer: [];
  toggleSettings: [];
  cycleFontScale: [];
}>();
</script>

<template>
  <div
    v-if="show"
    class="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 bg-surface/92 border-b border-border/50 backdrop-blur-md shadow-ink"
    @click.stop
  >
    <div class="flex items-center gap-1">
      <button
        class="rounded-md px-2 py-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        @click="emit('toggleDrawer')"
        title="目录"
      >
        <List :size="17" />
      </button>
      <button
        class="rounded-md px-2 py-1.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        @click="emit('toggleSettings')"
        title="设置"
      >
        <SlidersHorizontal :size="17" />
      </button>
    </div>

    <div class="flex items-center gap-1">
      <button
        class="rounded-md px-2.5 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        @click="emit('cycleFontScale')"
        :title="`字体: ${fontScaleLabel}`"
      >
        <Type :size="14" class="inline" />
        <span class="ml-1">{{ fontScaleLabel }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.float-top-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.float-top-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.float-top-enter-from,
.float-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
