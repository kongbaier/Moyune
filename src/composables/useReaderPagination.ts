import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  type Ref,
  type ComputedRef,
} from "vue";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function useReaderPagination(inputs: {
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
  chapterContent: Ref<string>;
  fontFamilyValue: ComputedRef<string>;
  parseSpacingPx: (containerWidth: number) => number;
  loading: Ref<boolean>;
  chapterTitle?: ComputedRef<string>;
  hasNextChapter?: ComputedRef<boolean>;
  hasPrevChapter?: ComputedRef<boolean>;
  onNavigateChapter?: (direction: "next" | "prev") => void;
}) {
  const {
    textConfig,
    layoutConfig,
    chapterContent,
    fontFamilyValue,
    parseSpacingPx,
    loading,
  } = inputs;

  const containerRef = ref<HTMLElement | null>(null);
  const measureRef = ref<HTMLElement | null>(null);

  const pages = ref<string[]>([]);
  const currentPage = ref(0);
  const isSingleColumn = ref(false);
  const carouselTransition = ref(true);
  const carouselEnterOffset = ref(0);

  let prevChapterTitle = "";

  const paragraphs = computed(() => {
    return chapterContent.value
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  });

  const totalColumns = computed(() => pages.value.length);

  const step = computed(() => (isSingleColumn.value ? 1 : 2));

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalColumns.value / step.value))
  );

  const canPrevPage = computed(() => {
    return (
      currentPage.value - step.value >= 0 ||
      (inputs.hasPrevChapter?.value ?? false)
    );
  });

  const canNextPage = computed(() => {
    return (
      currentPage.value + step.value < totalColumns.value ||
      (inputs.hasNextChapter?.value ?? false)
    );
  });

  const pageLabel = computed(() => {
    if (totalColumns.value === 0) return "0/0";
    return `${displayPageIndex.value + 1}/${totalPages.value}`;
  });

  const chapterProgress = computed(() => {
    if (totalPages.value <= 1) return 0;
    return Math.round(((displayPageIndex.value + 1) / totalPages.value) * 100);
  });

  const chapterWordCount = computed(() => {
    const cleaned = chapterContent.value.replace(/\s/g, "");
    if (!cleaned) return 0;
    return cleaned.length;
  });

  const displayPages = computed(() => {
    const result: { left: string; right: string | null }[] = [];
    const s = step.value;
    for (let i = 0; i < totalColumns.value; i += s) {
      result.push({
        left: pages.value[i] || "",
        right: !isSingleColumn.value ? pages.value[i + 1] || "" : null,
      });
    }
    if (result.length === 0) {
      result.push({ left: "", right: null });
    }
    return result;
  });

  const displayPageIndex = computed(() =>
    Math.floor(currentPage.value / step.value)
  );

  const pageGap = computed(() =>
    isSingleColumn.value ? "0" : layoutConfig.spaceing
  );

  const carouselStyle = computed(() => ({
    width: `${displayPages.value.length * 100}%`,
    transform: `translateX(calc(-${displayPageIndex.value * (100 / displayPages.value.length)}% + ${carouselEnterOffset.value}%))`,
    transition: carouselTransition.value ? "transform 0.3s ease-out" : "none",
  }));

  function buildPageOverlayHtml(page: {
    left: string;
    right: string | null;
  }): string {
    const colStyle = [
      "flex:1",
      "min-width:0",
      "overflow:hidden",
      `font-size:${textConfig.fontSize}px`,
      `font-weight:${textConfig.fontWeight}`,
      `line-height:${layoutConfig.lineHeight}`,
      `font-family:${fontFamilyValue.value}`,
      `letter-spacing:${layoutConfig.textSpacing}px`,
    ].join(";");

    return `<div style="display:flex;height:100%;gap:${pageGap.value};padding:0 ${layoutConfig.horizontalPadding}px">
      <div style="${colStyle}">${page.left}</div>
      ${page.right !== null ? `<div style="${colStyle}">${page.right}</div>` : ""}
    </div>`;
  }

  async function paginate() {
    if (
      !measureRef.value ||
      !containerRef.value ||
      paragraphs.value.length === 0
    ) {
      pages.value = [];
      return;
    }

    const containerRect = containerRef.value.getBoundingClientRect();
    const vPad = layoutConfig.verticalPadding;
    const hPad = layoutConfig.horizontalPadding;
    const spacingPx = isSingleColumn.value
      ? 0
      : parseSpacingPx(containerRect.width);
    const pageHeight = containerRect.height - vPad * 2;
    const colWidth = isSingleColumn.value
      ? containerRect.width - hPad * 2
      : (containerRect.width - hPad * 2 - spacingPx) / 2;

    Object.assign(measureRef.value.style, {
      width: `${colWidth}px`,
      fontSize: `${textConfig.fontSize}px`,
      fontWeight: String(textConfig.fontWeight),
      lineHeight: String(layoutConfig.lineHeight),
      fontFamily: fontFamilyValue.value,
      letterSpacing: `${layoutConfig.textSpacing}px`,
      position: "absolute",
      visibility: "hidden",
      top: "0",
      left: "0",
      padding: "0",
    });

    const escaped = paragraphs.value.map((p) => escapeHtml(p));
    const newPages: string[] = [];
    let cursor = 0;

    const title = inputs.chapterTitle?.value || "";
    const isNewChapter = title !== prevChapterTitle;
    if (isNewChapter) prevChapterTitle = title;
    const titleHtml =
      isNewChapter && title
        ? `<h1 class="chapter-title" style="font-size:${textConfig.fontSize * 1.5}px;font-weight:700;line-height:${layoutConfig.lineHeight};font-family:${fontFamilyValue.value};text-align:center;margin:0 0 ${layoutConfig.paragraphSpacing}em;letter-spacing:${layoutConfig.textSpacing}px">${escapeHtml(title)}</h1>`
        : "";

    while (cursor < escaped.length) {
      let measureContent = escaped
        .slice(cursor)
        .map(
          (p, i) =>
            `<p class="mp" data-rel="${i}" style="text-indent:${layoutConfig.textIndent}em;margin:0 0 ${layoutConfig.paragraphSpacing}em;word-break:break-all">${p}</p>`
        )
        .join("");

      if (cursor === 0 && titleHtml) {
        measureContent = titleHtml + measureContent;
      }

      measureRef.value.innerHTML = measureContent;
      await nextTick();

      const containerTop = measureRef.value.getBoundingClientRect().top;
      const pEls = measureRef.value.querySelectorAll<HTMLElement>(".mp");
      let fitCount = 0;

      for (const el of pEls) {
        const bottom = el.getBoundingClientRect().bottom - containerTop;
        if (bottom <= pageHeight) {
          fitCount++;
        } else {
          break;
        }
      }

      if (fitCount === 0 && pEls.length > 0) {
        const body = `<p style="text-indent:${layoutConfig.textIndent}em;margin:0 0 ${layoutConfig.paragraphSpacing}em;word-break:break-all">${escaped[cursor]}</p>`;
        newPages.push(cursor === 0 && titleHtml ? titleHtml + body : body);
        cursor++;
      } else {
        const slice = escaped.slice(cursor, cursor + fitCount);
        const body = slice
          .map(
            (p) =>
              `<p style="text-indent:${layoutConfig.textIndent}em;margin:0 0 ${layoutConfig.paragraphSpacing}em;word-break:break-all">${p}</p>`
          )
          .join("");
        newPages.push(cursor === 0 && titleHtml ? titleHtml + body : body);
        cursor += fitCount;
      }
    }

    pages.value = newPages;
    currentPage.value = Math.min(
      currentPage.value,
      Math.max(0, newPages.length - 1)
    );
  }

  function goToPage(n: number) {
    const max = Math.max(0, totalColumns.value - 1);
    const next = Math.max(0, Math.min(n, max));
    currentPage.value = next;
  }

  function prevPage() {
    const next = currentPage.value - step.value;
    if (next < 0) {
      inputs.onNavigateChapter?.("prev");
    } else {
      goToPage(next);
    }
  }

  function nextPage() {
    const next = currentPage.value + step.value;
    if (next >= totalColumns.value) {
      inputs.onNavigateChapter?.("next");
    } else {
      goToPage(next);
    }
  }

  function beginChapterTransition() {
    carouselTransition.value = false;
  }

  function endChapterTransition() {
    carouselTransition.value = true;
  }

  function setEnterOffset(offset: number) {
    carouselEnterOffset.value = offset;
  }

  // re-paginate when config changes
  watch(
    () => [
      textConfig.fontSize,
      textConfig.fontWeight,
      textConfig.fontFamily,
      layoutConfig.lineHeight,
      layoutConfig.paragraphSpacing,
      layoutConfig.textIndent,
      layoutConfig.textSpacing,
      layoutConfig.verticalPadding,
      layoutConfig.horizontalPadding,
      layoutConfig.spaceing,
    ],
    async () => {
      if (!loading.value) {
        await nextTick();
        await paginate();
      }
    }
  );

  watch(isSingleColumn, async () => {
    if (!loading.value) {
      await nextTick();
      await paginate();
    }
  });

  let resizeObs: ResizeObserver | null = null;

  onMounted(() => {
    if (containerRef.value) {
      resizeObs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          isSingleColumn.value = entry.contentRect.width < 640;
        }
      });
      resizeObs.observe(containerRef.value);
    }
  });

  onUnmounted(() => {
    if (resizeObs) resizeObs.disconnect();
  });

  return {
    containerRef,
    measureRef,
    pages,
    currentPage,
    isSingleColumn,
    paragraphs,
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
  };
}
