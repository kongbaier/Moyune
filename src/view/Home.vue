<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBookshelf, type Book } from "../api/books";
import BookCard from "../components/book/BookCard.vue";

const bookshelf = ref<Book[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    bookshelf.value = await getBookshelf();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="mx-auto h-full max-w-6xl px-10 py-10">
    <!-- ── 头部 ── -->
    <header class="mb-8 flex items-baseline gap-3">
      <h1
        class="text-2xl font-bold tracking-tight text-text-primary"
        style="font-family: var(--font-serif)"
      >
        书架
      </h1>
      <span v-if="!loading" class="text-[13px] text-text-muted tabular-nums">
        {{ bookshelf.length }} 本
      </span>
    </header>

    <!-- ── 加载态 ── -->
    <div
      v-if="loading"
      class="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="flex animate-pulse gap-5 rounded-2xl border border-border/60 bg-surface-elevated p-5"
      >
        <div
          class="shrink-0 rounded-lg bg-surface-hover"
          style="width: 100px; height: 136px"
        />
        <div class="flex flex-1 flex-col justify-between gap-3 py-0.5">
          <div class="space-y-2">
            <div class="h-4 w-3/4 rounded bg-surface-hover" />
            <div class="h-3 w-1/3 rounded bg-surface-hover" />
            <div class="h-3 w-full rounded bg-surface-hover" />
            <div class="h-3 w-2/3 rounded bg-surface-hover" />
          </div>
          <div class="space-y-2">
            <div class="flex gap-2">
              <div class="h-5 w-16 rounded-md bg-surface-hover" />
              <div class="h-5 w-14 rounded-md bg-surface-hover" />
            </div>
            <div class="h-1 w-full rounded-full bg-surface-hover" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── 空态 ── -->
    <div
      v-else-if="bookshelf.length === 0"
      class="flex flex-col items-center justify-center py-32"
    >
      <div
        class="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        style="
          background: linear-gradient(
            145deg,
            var(--accent-muted),
            var(--surface-hover)
          );
        "
      >
        <span
          class="select-none text-4xl font-bold leading-none text-accent-text/15"
          style="font-family: var(--font-serif)"
        >
          阅
        </span>
      </div>
      <p
        class="mb-1 text-lg font-semibold text-text-primary"
        style="font-family: var(--font-serif)"
      >
        书架尚空
      </p>
      <p
        class="max-w-xs text-center text-[13px] leading-relaxed text-text-muted"
      >
        你的书籍将会在这里展示，<br />开始添加第一本吧。
      </p>
    </div>

    <!-- ── 书架网格 ── -->
    <div
      v-else
      class="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5"
    >
      <BookCard
        v-for="(book, index) in bookshelf"
        :key="book.bookUrl"
        :book="book"
        class="animate-card-enter"
        :style="{ animationDelay: `${index * 50}ms` }"
      />
    </div>
  </div>
</template>
