<script setup lang="ts">
import { Minus, Plus } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }>(),
  {
    min: 0,
    max: 999,
    step: 1,
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

function dec() {
  const v = +(Number(props.modelValue) - props.step).toFixed(2);
  if (v >= props.min) emit("update:modelValue", v);
}

function inc() {
  const v = +(Number(props.modelValue) + props.step).toFixed(2);
  if (v <= props.max) emit("update:modelValue", v);
}
</script>

<template>
  <div class="inline-flex items-center gap-0.5 select-none">
    <button
      class="shrink-0 inline-flex items-center justify-center size-6 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:text-text-muted/15 disabled:cursor-not-allowed"
      :disabled="modelValue <= min"
      @click.stop="dec"
    >
      <Minus :size="14" />
    </button>
    <span
      class="inline-block w-9 text-center tabular-nums text-text-primary text-sm"
    >
      {{ modelValue }}
    </span>
    <button
      class="shrink-0 inline-flex items-center justify-center size-6 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer disabled:text-text-muted/15 disabled:cursor-not-allowed"
      :disabled="modelValue >= max"
      @click.stop="inc"
    >
      <Plus :size="14" />
    </button>
    <span v-if="unit" class="text-xs text-text-muted">{{ unit }}</span>
  </div>
</template>
