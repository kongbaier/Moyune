import { ref, computed, onMounted, nextTick, type Ref } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import {
  getChapterList,
  getChapterContent,
  type ChapterItem,
} from "../api/reader";

export function useReaderChapter(inputs: {
  bookUrl: Ref<string>;
  initialChapterIndex: number;
  initialChapterPos: number;
  chapterList: Ref<ChapterItem[]>;
  currentChapterIndex: Ref<number>;
  chapterContent: Ref<string>;
  loading: Ref<boolean>;
  currentPage: Ref<number>;
  pages: Ref<string[]>;
  displayPages: Ref<{ left: string; right: string | null }[]>;
  displayPageIndex: Ref<number>;
  paginate: () => Promise<void>;
  beginChapterTransition: () => void;
  endChapterTransition: () => void;
  setEnterOffset: (offset: number) => void;
  buildPageOverlayHtml: (page: {
    left: string;
    right: string | null;
  }) => string;
  doSaveProgress: (index: number, page: number) => void;
  router: Router;
  route: RouteLocationNormalizedLoaded;
}) {
  const {
    bookUrl,
    initialChapterIndex,
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
  } = inputs;

  const transitioning = ref(false);
  const leaveOverlay = ref<string | null>(null);
  const overlayDir = ref<"forward" | "backward">("forward");

  const contentCache = new Map<number, string>();

  const overlayTransitionName = computed(
    () => `slide-out-${overlayDir.value}`,
  );

  const totalChapters = computed(() => chapterList.value.length);

  function preloadChapter(index: number) {
    if (index < 0 || index >= totalChapters.value) return;
    if (contentCache.has(index)) return;
    getChapterContent(bookUrl.value, index)
      .then((content) => {
        contentCache.set(index, content);
      })
      .catch(() => {});
  }

  function preloadAdjacentChapters(current: number) {
    preloadChapter(current - 1);
    preloadChapter(current + 1);
  }

  async function loadChapterContent(index: number, startPage = 0) {
    transitioning.value = true;
    try {
      const cached = contentCache.get(index);
      chapterContent.value =
        cached ?? (await getChapterContent(bookUrl.value, index));
      currentChapterIndex.value = index;
      currentPage.value = startPage;
      await nextTick();
      await paginate();
    } catch {
      chapterContent.value = "章节加载失败，请稍后重试。";
      pages.value = [];
    } finally {
      loading.value = false;
      setTimeout(() => {
        transitioning.value = false;
      }, 300);
      preloadAdjacentChapters(index);
    }
  }

  async function onNavigateChapter(direction: "next" | "prev") {
    const targetIndex =
      direction === "next"
        ? currentChapterIndex.value + 1
        : currentChapterIndex.value - 1;
    if (targetIndex < 0 || targetIndex >= totalChapters.value) return;

    const dir = direction === "next" ? "forward" : "backward";
    overlayDir.value = dir;

    const snapshotPage = displayPages.value[displayPageIndex.value];
    if (snapshotPage) {
      leaveOverlay.value = buildPageOverlayHtml(snapshotPage);
    }

    await nextTick();

    beginChapterTransition();
    setEnterOffset(dir === "forward" ? 100 : -100);

    try {
      const cached = contentCache.get(targetIndex);
      chapterContent.value =
        cached ?? (await getChapterContent(bookUrl.value, targetIndex));
      currentChapterIndex.value = targetIndex;
      currentPage.value = 0;
      router.replace({
        query: { ...route.query, durChapterIndex: targetIndex },
      });
      await nextTick();
      await paginate();
      if (direction === "prev") {
        currentPage.value = Math.max(0, pages.value.length - 1);
      }
    } catch {
      chapterContent.value = "章节加载失败，请稍后重试。";
      pages.value = [];
    } finally {
      doSaveProgress(targetIndex, currentPage.value);
      preloadAdjacentChapters(targetIndex);
    }

    endChapterTransition();
    setEnterOffset(0);
    leaveOverlay.value = null;
  }

  function navigateToChapter(index: number) {
    if (index < 0 || index >= totalChapters.value) return;
    router.replace({
      query: { ...route.query, durChapterIndex: index },
    });
    loadChapterContent(index);
    doSaveProgress(index, 0);
  }

  onMounted(async () => {
    try {
      chapterList.value = await getChapterList(bookUrl.value);
    } catch {
      chapterList.value = [];
    }
    await loadChapterContent(initialChapterIndex, initialChapterPos);
  });

  return {
    transitioning,
    leaveOverlay,
    overlayDir,
    overlayTransitionName,
    loadChapterContent,
    onNavigateChapter,
    navigateToChapter,
  };
}
