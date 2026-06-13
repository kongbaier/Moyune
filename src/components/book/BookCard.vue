<script setup lang="ts">
import { computed, ref } from "vue";
import { BookOpen, Clock, Layers } from "@lucide/vue";
import type { Book } from "../../api/books";

const props = defineProps<{
  book: Book;
}>();

/** 阅读进度百分比 */
const progressPercent = computed(() => {
  if (!props.book.totalChapterNum) return 0;
  return Math.round(
    ((props.book.durChapterIndex + 1) / props.book.totalChapterNum) * 100
  );
});

/** 格式化字数 */
const formattedWordCount = computed(() => {
  const wc = props.book.wordCount;
  if (!wc) return null;
  // wc 可能是字符串 "xx万字" 或纯数字
  if (typeof wc === "string" && wc.includes("万")) return wc;
  const n = Number(wc);
  if (Number.isNaN(n)) return wc;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)} 万字`;
  return `${n} 字`;
});

/** 封面加载失败时显示占位 */
const coverError = ref(false);
</script>

<template>
  <article
    class="book-card group relative flex cursor-pointer gap-5 rounded-2xl border border-border/60 bg-surface-elevated p-5 theme-transition hover:-translate-y-0.5 hover:shadow-card-hover"
  >
    <!-- ── 左侧：封面 ── -->
    <div
      class="relative shrink-0 overflow-hidden rounded-lg"
      style="width: 100px; height: 136px"
    >
      <img
        v-if="book.coverUrl && !coverError"
        :src="book.coverUrl"
        :alt="book.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        @error="coverError = true"
      />
      <!-- 占位封面 -->
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-1.5"
        style="
          background: linear-gradient(
            145deg,
            var(--accent-muted),
            var(--surface-hover)
          );
        "
      >
        <BookOpen class="size-5 text-accent-text/25" />
        <span
          class="select-none text-[10px] font-bold tracking-wide text-accent-text/18"
          style="font-family: var(--font-serif)"
        >
          {{ book.kind || "书籍" }}
        </span>
      </div>
    </div>

    <!-- ── 右侧：信息 ── -->
    <div class="flex min-w-0 flex-1 flex-col justify-between py-0.5">
      <!-- 顶部：标题 & 作者 -->
      <div>
        <h3
          class="truncate text-[15px] font-bold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-accent-text"
          style="font-family: var(--font-serif)"
          :title="book.name"
        >
          {{ book.name }}
        </h3>
        <p
          class="mt-1 truncate text-[13px] text-text-muted/80"
          :title="book.author"
        >
          {{ book.author || "佚名" }}
        </p>

        <!-- 简介 -->
        <p
          v-if="book.intro"
          class="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-text-secondary/70"
          :title="book.intro"
        >
          {{ book.intro }}
        </p>
      </div>

      <!-- 底部：元信息 & 进度 -->
      <div class="mt-3 space-y-2.5">
        <!-- 标签行 -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- 来源 -->
          <span
            v-if="book.originName"
            class="inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-text-muted/70"
          >
            <Layers class="size-3" />
            {{ book.originName }}
          </span>
          <!-- 字数 -->
          <span
            v-if="formattedWordCount"
            class="inline-flex items-center gap-1 rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-text-muted/70"
          >
            {{ formattedWordCount }}
          </span>
          <!-- 最新章 -->
          <span
            v-if="book.latestChapterTitle"
            class="inline-flex items-center gap-1 truncate rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-text-muted/70"
            :title="book.latestChapterTitle"
          >
            <Clock class="size-3 shrink-0" />
            <span class="truncate">至 {{ book.latestChapterTitle }}</span>
          </span>
        </div>

        <!-- 阅读进度条 -->
        <div v-if="book.totalChapterNum > 0" class="flex items-center gap-2.5">
          <div class="h-1 flex-1 overflow-hidden rounded-full bg-surface-hover">
            <div
              class="h-full rounded-full bg-accent/50 transition-all duration-500 group-hover:bg-accent"
              :style="{ width: `${Math.min(progressPercent, 100)}%` }"
            />
          </div>
          <span class="shrink-0 text-[11px] tabular-nums text-text-muted/60">
            {{ book.durChapterIndex + 1 }}/{{ book.totalChapterNum }}
          </span>
        </div>

        <!-- 当前阅读章节 -->
        <p
          v-if="book.durChapterTitle"
          class="truncate text-[11px] text-text-muted/50"
          :title="book.durChapterTitle"
        >
          当前：{{ book.durChapterTitle }}
        </p>
      </div>
    </div>

    <!-- ── Hover 高亮条 ── -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl rounded-t-sm bg-accent/0 transition-all duration-400 group-hover:bg-accent/60"
    />
  </article>
</template>
