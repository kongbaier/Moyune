<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDown } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: { label: string; value: string | number }[];
    placeholder?: string;
  }>(),
  {
    placeholder: "请选择",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (!open.value) return;
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocClick, true));
onUnmounted(() => document.removeEventListener("click", onDocClick, true));

const currentLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? ""
);

function pick(value: string | number) {
  emit("update:modelValue", value);
  open.value = false;
}

function toggleOpen() {
  open.value = !open.value;
}
</script>

<template>
  <div ref="rootRef" class="relative inline-block">
    <button
      class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm outline-none transition-all cursor-pointer select-none min-w-[120px]"
      :class="
        open
          ? 'border-accent ring-2 ring-accent-muted bg-surface-elevated text-text-primary'
          : 'border-border bg-surface text-text-primary hover:border-border-strong'
      "
      @click.stop="toggleOpen"
      @keydown.escape="open = false"
    >
      <span class="flex-1 text-left truncate">{{
        currentLabel || placeholder
      }}</span>
      <ChevronDown
        :size="14"
        class="shrink-0 text-text-muted transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <ul
      v-if="open"
      class="absolute left-0 right-0 top-full mt-1 z-10 rounded-md border border-border bg-surface-elevated shadow-ink-lg py-1 overflow-hidden"
      @click.stop
    >
      <li
        v-for="opt in options"
        :key="String(opt.value)"
        class="px-3 py-2 text-sm cursor-pointer transition-colors"
        :class="
          opt.value === modelValue
            ? 'bg-accent-muted text-accent-text font-medium'
            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
        "
        @click="pick(opt.value)"
      >
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>
