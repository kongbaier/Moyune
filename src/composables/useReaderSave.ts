import { watch, type Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { saveBookProgress, type ChapterItem } from "../api/reader";

export function useReaderSave(inputs: {
  bookName: Ref<string>;
  bookUrl: Ref<string>;
  bookAuthor: Ref<string>;
  chapterList: Ref<ChapterItem[]>;
  currentChapterIndex: Ref<number>;
  currentPage: Ref<number>;
}) {
  const { bookName, bookUrl, bookAuthor, chapterList, currentChapterIndex, currentPage } =
    inputs;

  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  function doSaveProgress(index: number, page: number) {
    if (!bookName.value || !bookUrl.value) return;
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const title = chapterList.value[index]?.title || "";
    saveBookProgress(
      {
        name: bookName.value,
        author: bookAuthor.value,
        durChapterIndex: index,
        durChapterPos: page,
        durChapterTime: Date.now(),
        durChapterTitle: title,
      },
      abortController.signal,
    ).catch((err: unknown) => {
      if (err instanceof DOMException && err.name === "AbortError") return;
    });
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      doSaveProgress(currentChapterIndex.value, currentPage.value);
    }, 1000);
  }

  watch(currentPage, () => {
    scheduleSave();
  });

  onBeforeRouteLeave(() => {
    doSaveProgress(currentChapterIndex.value, currentPage.value);
    if (saveTimer) clearTimeout(saveTimer);
  });

  return { doSaveProgress };
}
