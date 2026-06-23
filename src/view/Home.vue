<script setup lang="ts">
import { onMounted, onActivated, ref } from "vue";
import { getBookshelf, refreshBookshelf, type Book } from "../api/books";
import BookCard from "../components/book/BookCard.vue";

const bookshelf = ref<Book[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    bookshelf.value = await getBookshelf();
  } catch {
  } finally {
    loading.value = false;
  }

  refreshBookshelf()
    .then((fresh) => {
      bookshelf.value = fresh;
    })
    .catch(() => {});
});

onActivated(() => {
  refreshBookshelf()
    .then((fresh) => {
      bookshelf.value = fresh;
    })
    .catch(() => {});
});
</script>

<template>
  <div class="mx-auto h-full max-w-6xl px-10 py-10">
    <header class="mb-10 flex items-baseline gap-4">
      <h1
        class="text-3xl font-bold tracking-widest text-text-primary"
        style="font-family: var(--font-display)"
      >
        书架
      </h1>
      <span
        v-if="!loading"
        class="inline-flex items-center gap-1.5 text-[13px] text-text-muted"
      >
        <span class="block w-4 h-px bg-text-muted/30" />
        共 {{ bookshelf.length }} 本
      </span>
    </header>

    <div
      v-if="loading"
      class="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="flex animate-pulse gap-5 rounded-2xl border border-border/50 bg-surface-elevated p-5"
      >
        <div
          class="shrink-0 self-stretch rounded-lg bg-surface-hover aspect-3/4"
        />
        <div class="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div class="h-4 w-3/4 rounded bg-surface-hover" />
            <div class="mt-1 h-3 w-1/3 rounded bg-surface-hover" />
            <div class="mt-2.5" style="min-height: 2.625rem">
              <div class="h-3 w-full rounded bg-surface-hover" />
              <div class="mt-1 h-3 w-2/3 rounded bg-surface-hover" />
            </div>
          </div>
          <div
            class="mt-3 flex flex-col justify-end"
            style="min-height: 4.75rem"
          >
            <div class="space-y-2.5">
              <div class="flex items-center gap-2" style="min-height: 1.625rem">
                <div class="h-5 w-16 rounded-md bg-surface-hover" />
                <div class="h-5 w-14 rounded-md bg-surface-hover" />
              </div>
              <div style="min-height: 1rem">
                <div class="flex items-center gap-2.5">
                  <div class="h-1 flex-1 rounded-full bg-surface-hover" />
                  <div class="h-3 w-12 rounded bg-surface-hover" />
                </div>
              </div>
              <div style="min-height: 1rem">
                <div class="h-3 w-2/5 rounded bg-surface-hover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="bookshelf.length === 0"
      class="flex flex-col items-center justify-center py-32"
    >
      <div
        class="mb-6 flex h-28 w-28 items-center justify-center rounded-full"
        style="
          background: radial-gradient(
            circle at 40% 40%,
            var(--accent-muted),
            var(--surface-hover)
          );
        "
      >
        <span
          class="select-none text-5xl font-bold leading-none text-accent-text/10"
          style="font-family: var(--font-display)"
        >
          阅
        </span>
      </div>
      <p
        class="mb-1 text-xl tracking-wider text-text-primary"
        style="font-family: var(--font-display)"
      >
        书架尚空
      </p>
      <p
        class="max-w-xs text-center text-[13px] leading-relaxed text-text-muted"
      >
        你的书籍将会在这里展示，<br />开始添加第一本吧。
      </p>
    </div>

    <div
      v-else
      class="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-5 pb-8"
    >
      <BookCard
        v-for="(book, index) in bookshelf"
        :key="book.bookUrl"
        :book="book"
        class="animate-ink-reveal"
        :style="{ animationDelay: `${index * 60}ms` }"
      />
    </div>
  </div>
</template>
