<script setup lang="ts">
import { ref, markRaw, type Component } from "vue";
import { X, Type, Columns2 } from "@lucide/vue";
import Stepper from "./Stepper.vue";
import SelectInk from "./SelectInk.vue";

const props = defineProps<{
  modelValue: boolean;
  textConfig: {
    fontSize: number;
    fontWeight: number;
    fontFamily: string;
  };
  layoutConfig: {
    horizontalPadding: number;
    verticalPadding: number;
    spaceing: string;
    lineHeight: number;
    paragraphSpacing: number;
    textIndent: number;
    textSpacing: number;
  };
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

type Section = "style" | "layout";

const activeSection = ref<Section>("style");

const sections: { key: Section; label: string; icon: Component }[] = [
  { key: "style", label: "阅读样式", icon: markRaw(Type) },
  { key: "layout", label: "布局", icon: markRaw(Columns2) },
];

function close() {
  emit("update:modelValue", false);
}

const weightOptions = [
  { label: "300 Light", value: 300 },
  { label: "400 Regular", value: 400 },
  { label: "500 Medium", value: 500 },
  { label: "600 SemiBold", value: 600 },
  { label: "700 Bold", value: 700 },
];

const fontOptions = [
  { label: "系统默认", value: "" },
  { label: "宋体", value: "SimSun, Songti SC, serif" },
  { label: "黑体", value: "SimHei, Heiti SC, sans-serif" },
  { label: "微软雅黑", value: "Microsoft YaHei, PingFang SC, sans-serif" },
  { label: "楷体", value: "KaiTi, Kaiti SC, serif" },
  { label: "仿宋", value: "FangSong, Songti SC, serif" },
  { label: "思源宋体", value: "'Noto Serif SC', 'Source Han Serif SC', serif" },
  {
    label: "思源黑体",
    value: "'Noto Sans SC', 'Source Han Sans SC', sans-serif",
  },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Palatino", value: "Palatino, 'Palatino Linotype', serif" },
];
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-8"
      @click.self="close"
    >
      <div
        class="flex w-200 h-150 rounded-xl border border-border bg-surface-elevated shadow-ink-lg overflow-hidden"
        @click.stop
      >
        <!-- Sidebar -->
        <nav class="w-45 shrink-0 border-r border-border flex flex-col">
          <h2
            class="text-base font-bold tracking-wider text-text-primary py-3 px-4"
            style="font-family: var(--font-display)"
          >
            设置
          </h2>
          <ul class="space-y-0.5 text-[13px] pb-6 px-2">
            <li
              v-for="sec in sections"
              :key="sec.key"
              class="cursor-pointer rounded-md px-3 py-2 transition-colors flex items-center"
              :class="
                activeSection === sec.key
                  ? 'bg-accent-muted text-accent-text font-medium'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              "
              @click="activeSection = sec.key"
            >
              <component :is="sec.icon" class="size-3.5 mr-3 inline" />
              {{ sec.label }}
            </li>
          </ul>
        </nav>

        <!-- Content -->
        <div class="flex-1 min-w-0 flex flex-col">
          <div
            class="flex items-center justify-between border-b border-border px-5 py-3"
          >
            <h3 class="text-sm font-semibold text-text-primary">
              {{ sections.find((s) => s.key === activeSection)?.label }}
            </h3>
            <button
              class="rounded-md p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              @click="close"
            >
              <X :size="16" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-sm">
            <!-- 阅读样式 -->
            <template v-if="activeSection === 'style'">
              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">字号</span>
                <Stepper
                  v-model="textConfig.fontSize"
                  :min="10"
                  :max="48"
                  :step="2"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">字重</span>
                <SelectInk
                  :model-value="textConfig.fontWeight"
                  :options="weightOptions"
                  @update:model-value="textConfig.fontWeight = $event as number"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">字体</span>
                <SelectInk
                  :model-value="textConfig.fontFamily"
                  :options="fontOptions"
                  @update:model-value="textConfig.fontFamily = $event as string"
                />
              </div>
            </template>

            <!-- 布局 -->
            <template v-if="activeSection === 'layout'">
              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">左右边距</span>
                <div class="flex items-center gap-1">
                  <Stepper
                    v-model="layoutConfig.horizontalPadding"
                    :min="0"
                    :max="200"
                    :step="4"
                    unit="px"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">上下边距</span>
                <div class="flex items-center gap-1">
                  <Stepper
                    v-model="layoutConfig.verticalPadding"
                    :min="0"
                    :max="200"
                    :step="4"
                    unit="px"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">栏间距</span>
                <div class="flex items-center gap-1">
                  <input
                    :value="layoutConfig.spaceing"
                    type="text"
                    class="w-20 rounded-md border border-border bg-surface px-2 py-1 text-text-primary text-sm outline-none"
                    @input="
                      layoutConfig.spaceing = (
                        $event.target as HTMLInputElement
                      ).value
                    "
                  />
                  <span class="text-xs text-text-muted">(px/%)</span>
                </div>
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">行高</span>
                <Stepper
                  v-model="layoutConfig.lineHeight"
                  :min="0.8"
                  :max="3"
                  :step="0.1"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">段落间距</span>
                <Stepper
                  v-model="layoutConfig.paragraphSpacing"
                  :min="0"
                  :max="5"
                  :step="0.1"
                  unit="em"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">首行缩进</span>
                <Stepper
                  v-model="layoutConfig.textIndent"
                  :min="0"
                  :max="8"
                  :step="0.5"
                  unit="em"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="text-text-secondary shrink-0">字间距</span>
                <Stepper
                  v-model="layoutConfig.textSpacing"
                  :min="0"
                  :max="20"
                  :step="1"
                  unit="px"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
