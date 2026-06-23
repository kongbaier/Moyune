<script setup lang="ts">
import { ref } from "vue";
import { ArrowLeft, List, SlidersHorizontal, Type, Sun, Moon } from "@lucide/vue";

defineProps<{
  bookName: string;
  loading: boolean;
  fontSizeLabel: string;
}>();

const emit = defineEmits<{
  "toggle-drawer": [];
  "toggle-settings": [];
  "cycle-font-scale": [];
  back: [];
}>();

const hover = ref(false);

const isDark = ref(document.documentElement.classList.contains("dark"));

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}
</script>

<template>
  <div
    class="relative shrink-0"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <header class="h-12 flex items-center gap-2 px-3">
      <button
        class="flex items-center justify-center size-8 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-surface-hover transition-colors -ml-1 shrink-0"
        title="目录"
        @click="emit('toggle-drawer')"
      >
        <List class="size-4" />
      </button>

      <span
        v-if="!hover"
        class="flex-1 text-center truncate text-xs font-medium text-text-muted"
      >
        {{ bookName }}
      </span>
      <span v-else class="flex-1" />

      <div class="flex items-center gap-0.5 shrink-0">
        <template v-if="hover && !loading">
          <button
            class="flex items-center justify-center size-8 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-surface-hover transition-colors"
            title="设置"
            @click="emit('toggle-settings')"
          >
            <SlidersHorizontal class="size-[17px]" />
          </button>
          <button
            class="flex items-center justify-center size-8 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-surface-hover transition-colors"
            :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          >
            <component :is="isDark ? Sun : Moon" class="size-[17px]" />
          </button>
          <button
            class="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-text-muted/60 hover:text-text-primary hover:bg-surface-hover transition-colors"
            :title="`字体: ${fontSizeLabel}`"
            @click="emit('cycle-font-scale')"
          >
            <Type class="size-3.5" />
            <span>{{ fontSizeLabel }}</span>
          </button>
        </template>
        <button
          class="flex items-center justify-center size-8 rounded-lg text-text-muted/60 hover:text-text-primary hover:bg-surface-hover transition-colors -mr-1"
          title="返回书架"
          @click="emit('back')"
        >
          <ArrowLeft class="size-4" />
        </button>
      </div>
    </header>
  </div>
</template>
