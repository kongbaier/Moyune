<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { BookOpen, Clock, Layers } from "@lucide/vue";
import type { Book } from "../../api/books";

const router = useRouter();

function goToReader() {
  router.push({
    path: `/reader/${encodeURIComponent(props.book.bookUrl)}`,
    query: {
      name: props.book.name,
      author: props.book.author,
      durChapterIndex: props.book.durChapterIndex,
      durChapterPos: props.book.durChapterPos,
    },
  });
}

const props = defineProps<{
  book: Book;
}>();

const progressPercent = computed(() => {
  if (!props.book.totalChapterNum) return 0;
  return Math.round(
    ((props.book.durChapterIndex + 1) / props.book.totalChapterNum) * 100
  );
});

const formattedWordCount = computed(() => {
  const wc = props.book.wordCount;
  if (!wc) return null;
  if (typeof wc === "string" && wc.includes("万")) return wc;
  const n = Number(wc);
  if (Number.isNaN(n)) return wc;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)} 万字`;
  return `${n} 字`;
});

const formattedIntro = computed(() => {
  if (!props.book.intro) return "";
  return props.book.intro
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\\n/g, "<br>")
    .replace(/\n/g, "<br>");
});

const coverError = ref(false);
</script>

<template>
  <article
    class="h-60 group relative flex cursor-pointer gap-5 rounded-2xl border border-border/50 bg-surface-elevated p-5 paper-texture shadow-ink transition-shadow duration-500 hover:-translate-y-0.5 hover:shadow-ink-lg"
    @click="goToReader"
  >
    <div class="relative shrink-0 overflow-hidden rounded-lg aspect-3/4">
      <img
        v-if="book.coverUrl && !coverError"
        :src="book.coverUrl"
        :alt="book.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        @error="coverError = true"
      />
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
        <BookOpen class="size-5 text-accent-text/20" />
        <span
          class="select-none text-[10px] font-bold tracking-wide text-accent-text/15"
          style="font-family: var(--font-serif)"
        >
          {{ book.kind || "书籍" }}
        </span>
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col py-0.5">
      <div>
        <h3
          class="truncate text-[15px] font-bold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-accent-text"
          :title="book.name"
        >
          {{ book.name }}
        </h3>
        <p
          class="truncate text-[13px] leading-snug text-text-muted/70"
          :title="book.author"
        >
          {{ book.author || "佚名" }}
        </p>
      </div>

      <div class="tag-scroll mt-1.5 flex items-center gap-1.5 overflow-x-auto">
        <span
          v-if="book.originName"
          class="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted/60"
        >
          <Layers class="size-3" />
          {{ book.originName }}
        </span>
        <span
          v-if="formattedWordCount"
          class="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted/60"
        >
          {{ formattedWordCount }}
        </span>
        <span
          v-if="book.latestChapterTitle"
          class="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/50 px-2 py-0.5 text-[11px] text-text-muted/60"
          :title="book.latestChapterTitle"
        >
          <Clock class="size-3 shrink-0" />
          <span class="max-w-[8em] truncate"
            >至 {{ book.latestChapterTitle }}</span
          >
        </span>
      </div>

      <p
        v-if="book.intro"
        v-html="formattedIntro"
        class="intro-clamp mt-1.5 flex-1 text-xs leading-relaxed text-text-secondary/60"
        :title="book.intro"
      />

      <div class="mt-1.5 flex items-center gap-2">
        <template v-if="book.totalChapterNum > 0">
          <div
            class="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-surface-hover"
          >
            <div
              class="h-full rounded-full bg-accent/60 origin-left transition-all duration-700 group-hover:bg-accent"
              :style="{
                transform: `scaleX(${Math.min(progressPercent, 100) / 100})`,
              }"
            />
          </div>
          <span class="shrink-0 text-[11px] tabular-nums text-text-muted/50">
            {{ book.durChapterIndex + 1 }}/{{ book.totalChapterNum }}
          </span>
        </template>
        <p
          v-if="book.durChapterTitle"
          class="min-w-0 flex-1 truncate text-[11px] text-text-muted/40"
          :title="book.durChapterTitle"
        >
          {{ book.durChapterTitle }}
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.intro-clamp {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
}

.tag-scroll {
  scrollbar-width: none;
}
.tag-scroll::-webkit-scrollbar {
  display: none;
}
</style>
