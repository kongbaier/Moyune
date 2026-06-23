<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { type ChapterItem } from "../api/reader";
import {
  ReaderDrawer,
  ReaderFloatingBottom,
  ReaderHeader,
  ReaderSettings,
} from "../components/reader";
import { useReaderConfig } from "../composables/useReaderConfig";
import { useReaderPagination } from "../composables/useReaderPagination";
import { useReaderSave } from "../composables/useReaderSave";
import { useReaderChapter } from "../composables/useReaderChapter";
import { useReaderHotkeys } from "../composables/useReaderHotkeys";

const {
  textConfig,
  layoutConfig,
  fontFamilyValue,
  fontSizeLabel,
  cycleFontScale,
  parseSpacingPx,
} = useReaderConfig();

const router = useRouter();
const route = useRoute();

const bookUrl = computed(() => {
  const url = route.params.bookUrl;
  return Array.isArray(url) ? url[0] : url;
});

const bookName = computed(() => {
  const n = route.query.name;
  return (Array.isArray(n) ? n[0] : n) || "";
});

const bookAuthor = computed(() => {
  const a = route.query.author;
  return (Array.isArray(a) ? a[0] : a) || "";
});

const currentChapterIndex = ref(Number(route.query.durChapterIndex) || 0);
const initialChapterPos = Number(route.query.durChapterPos) || 0;

const chapterList = ref<ChapterItem[]>([]);
const chapterContent = ref("");
const loading = ref(true);

const currentChapterTitle = computed(() => {
  return chapterList.value[currentChapterIndex.value]?.title || "";
});

const hasNextChapter = computed(
  () => currentChapterIndex.value + 1 < chapterList.value.length,
);
const hasPrevChapter = computed(() => currentChapterIndex.value > 0);

const onNavChapter = ref<((dir: "next" | "prev") => void) | undefined>();
function onNavigateChapter(dir: "next" | "prev") {
  onNavChapter.value?.(dir);
}

const {
  containerRef,
  measureRef,
  pages,
  currentPage,
  isSingleColumn,
  totalPages,
  canPrevPage,
  canNextPage,
  pageLabel,
  chapterProgress,
  chapterWordCount,
  paginate,
  goToPage,
  prevPage,
  nextPage,
  displayPages,
  displayPageIndex,
  pageGap,
  carouselStyle,
  buildPageOverlayHtml,
  beginChapterTransition,
  endChapterTransition,
  setEnterOffset,
} = useReaderPagination({
  textConfig,
  layoutConfig,
  chapterContent,
  fontFamilyValue,
  parseSpacingPx,
  loading,
  chapterTitle: currentChapterTitle,
  hasNextChapter,
  hasPrevChapter,
  onNavigateChapter,
});

void containerRef;
void measureRef;

const { doSaveProgress } = useReaderSave({
  bookName,
  bookUrl,
  bookAuthor,
  chapterList,
  currentChapterIndex,
  currentPage,
});

const {
  transitioning,
  leaveOverlay,
  overlayTransitionName,
  navigateToChapter,
  onNavigateChapter: chapterOnNavigate,
} = useReaderChapter({
  bookUrl,
  initialChapterIndex: Number(route.query.durChapterIndex) || 0,
  initialChapterPos,
  chapterList,
  currentChapterIndex,
  chapterContent,
  loading,
  currentPage,
  pages,
  displayPages,
  displayPageIndex,
  paginate,
  beginChapterTransition,
  endChapterTransition,
  setEnterOffset,
  buildPageOverlayHtml,
  doSaveProgress,
  router,
  route,
});

onNavChapter.value = chapterOnNavigate;

const textStyle = computed(() => ({
  fontSize: `${textConfig.fontSize}px`,
  fontWeight: textConfig.fontWeight,
  lineHeight: layoutConfig.lineHeight,
  fontFamily: fontFamilyValue.value,
  letterSpacing: `${layoutConfig.textSpacing}px`,
}));

const showDrawer = ref(false);
const showControls = ref(false);
const hoverFooter = ref(false);
const showSettings = ref(false);

const showBottom = computed(
  () => (showControls.value || hoverFooter.value) && !loading.value,
);

function goToChapter(index: number) {
  showDrawer.value = false;
  showControls.value = false;
  navigateToChapter(index);
}

const { onClick } = useReaderHotkeys({
  containerRef,
  prevPage,
  nextPage,
  toggleControls: () => {
    showControls.value = !showControls.value;
  },
});
</script>

<template>
  <ReaderDrawer
    v-model="showDrawer"
    :chapter-list="chapterList"
    :current-chapter-index="currentChapterIndex"
    @select="goToChapter"
  />

  <ReaderSettings
    v-model="showSettings"
    :text-config="textConfig"
    :layout-config="layoutConfig"
  />

  <div
    class="fixed inset-0 flex flex-col bg-surface select-none"
  >
    <ReaderHeader
      :book-name="bookName"
      :loading="loading"
      :font-size-label="fontSizeLabel"
      @toggle-drawer="showDrawer = true"
      @toggle-settings="showSettings = !showSettings"
      @cycle-font-scale="cycleFontScale"
      @back="router.push('/')"
    />

    <main
      ref="containerRef"
      class="relative flex-1 min-h-0 overflow-hidden"
      :style="{
        padding: `${layoutConfig.verticalPadding}px 0`,
      }"
      @click="onClick"
    >
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-full"
      >
        <div class="h-2 w-24 rounded-full bg-surface-hover overflow-hidden">
          <div class="h-full w-1/2 rounded-full bg-accent/30 animate-pulse" />
        </div>
      </div>

      <div
        v-else-if="pages.length > 0"
        class="h-full"
        :class="{ 'opacity-40': transitioning }"
      >
        <Transition :name="overlayTransitionName">
          <div
            v-if="leaveOverlay"
            class="absolute inset-0 z-20"
            v-html="leaveOverlay"
          />
        </Transition>
        <div class="flex h-full" :style="carouselStyle">
          <div
            v-for="(page, i) in displayPages"
            :key="i"
            class="shrink-0 h-full flex"
            :style="{
              width: `${100 / displayPages.length}%`,
              gap: pageGap,
              padding: `0 ${layoutConfig.horizontalPadding}px`,
            }"
          >
            <div
              class="flex-1 min-w-0 overflow-hidden"
              :style="textStyle"
              v-html="page.left"
            />
            <div
              v-if="!isSingleColumn"
              class="flex-1 min-w-0 overflow-hidden"
              :style="textStyle"
              v-html="page.right"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-center h-full text-sm text-text-muted"
      >
        暂无内容
      </div>
    </main>

    <div
      class="relative shrink-0"
      @mouseenter="hoverFooter = true"
      @mouseleave="hoverFooter = false"
    >
      <footer
        class="h-12 flex items-center justify-between px-10"
      >
        <span class="text-[11px] tabular-nums text-text-muted w-16 text-left">
          {{ pageLabel }}
        </span>
        <span class="text-[11px] text-text-muted truncate mx-2 text-center">
          第{{ currentChapterIndex + 1 }}章 {{ currentChapterTitle }}
        </span>
        <span class="text-[11px] tabular-nums text-text-muted w-16 text-right">
          约{{ chapterWordCount }}字
        </span>
      </footer>
      <ReaderFloatingBottom
        :show="showBottom"
        :current-page="currentPage"
        :total-pages="totalPages"
        :chapter-progress="chapterProgress"
        :can-prev-page="canPrevPage"
        :can-next-page="canNextPage"
        @seek="goToPage"
        @prev="prevPage"
        @next="nextPage"
      />
    </div>

    <div
      ref="measureRef"
      class="fixed pointer-events-none"
      aria-hidden="true"
    />
  </div>
</template>
