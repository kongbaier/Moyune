<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { X } from "@lucide/vue";
import type { ChapterItem } from "../../api/reader";

const props = defineProps<{
  modelValue: boolean;
  chapterList: ChapterItem[];
  currentChapterIndex: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  select: [index: number];
}>();

const listRef = ref<HTMLElement | null>(null);
const itemRefs: Record<number, HTMLElement> = {};

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return;
    await nextTick();
    const container = listRef.value;
    const target = itemRefs[props.currentChapterIndex];
    if (!container || !target) return;
    const itemH = target.offsetHeight;
    const relativeTop = target.offsetTop - container.offsetTop;
    const scrollTo = relativeTop - itemH;
    container.scrollTop = Math.max(
      0,
      Math.min(scrollTo, container.scrollHeight - container.clientHeight),
    );
  },
);

function close() {
  emit("update:modelValue", false);
}

function selectChapter(index: number) {
  emit("select", index);
}

function setItemRef(idx: number) {
  return (el: unknown) => {
    if (el instanceof HTMLElement) {
      itemRefs[idx] = el;
    }
  };
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex">
        <div class="absolute inset-0" @click="close" />
        <aside
          class="relative mr-auto h-full w-72 border-r border-border bg-surface-elevated paper-texture shadow-ink-lg scrollbar-ink animate-slide-in-left flex flex-col"
          @click.stop
        >
          <div
            class="top-0 z-10 flex items-center justify-between border-b border-border bg-surface-elevated/90 px-5 py-4"
          >
            <h3 class="text-sm font-semibold text-text-primary">目录</h3>
            <button
              class="rounded-md p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              @click="close"
            >
              <X :size="16" />
            </button>
          </div>
          <ul ref="listRef" class="px-3 py-2 flex-1 overflow-y-auto">
            <li
              v-for="(ch, idx) in chapterList"
              :key="idx"
              :ref="setItemRef(idx)"
              class="cursor-pointer rounded-md px-3 py-2.5 text-sm transition-colors"
              :class="
                idx === currentChapterIndex
                  ? 'bg-accent-muted text-accent-text font-medium'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              "
              @click="selectChapter(idx)"
            >
              {{ ch.title }}
            </li>
          </ul>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}

.drawer-enter-active {
  transition: opacity 0.25s ease;
}
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .animate-slide-in-left {
  animation: slide-in-left 0.3s ease-out;
}
.drawer-leave-active .animate-slide-in-left {
  animation: slide-out-left 0.2s ease-in forwards;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
