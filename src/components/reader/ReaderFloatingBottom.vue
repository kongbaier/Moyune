<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";

const props = defineProps<{
  show: boolean;
  currentPage: number;
  totalPages: number;
  chapterProgress: number;
  canPrevPage: boolean;
  canNextPage: boolean;
}>();

const emit = defineEmits<{
  seek: [page: number];
  prev: [];
  next: [];
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("seek", Number(target.value));
}
</script>

<template>
  <Transition name="float-bottom">
    <div
      v-if="show && totalPages > 0"
      class="absolute bottom-0 left-0 right-0 z-30 px-5 py-3 bg-surface/92 border-t border-border/50 backdrop-blur-md shadow-ink"
      @click.stop
    >
      <div class="flex items-center gap-3">
        <input
          type="range"
          :min="0"
          :max="Math.max(0, totalPages - 1)"
          :value="currentPage"
          class="flex-1 h-1 rounded-full appearance-none cursor-pointer progress-range"
          @input="onInput"
        />
        <span
          class="text-xs tabular-nums text-text-muted shrink-0 w-9 text-right"
        >
          {{ chapterProgress }}%
        </span>
        <div class="flex items-center gap-1 shrink-0">
          <button
            class="rounded-md p-1.5 transition-colors cursor-pointer"
            :class="
              canPrevPage
                ? 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                : 'text-text-muted/20 cursor-not-allowed'
            "
            :disabled="!canPrevPage"
            @click="emit('prev')"
          >
            <ChevronLeft :size="18" />
          </button>
          <button
            class="rounded-md p-1.5 transition-colors cursor-pointer"
            :class="
              canNextPage
                ? 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                : 'text-text-muted/20 cursor-not-allowed'
            "
            :disabled="!canNextPage"
            @click="emit('next')"
          >
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.float-bottom-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.float-bottom-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.float-bottom-enter-from,
.float-bottom-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.progress-range {
  background: var(--surface-hover);
  height: 4px;
}
.progress-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: 2px solid var(--surface);
  box-shadow: 0 1px 3px oklch(0% 0 0 / 0.15);
}
.progress-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  border: 2px solid var(--surface);
}
</style>
