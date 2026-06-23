import { onMounted, onUnmounted, type Ref } from "vue";

const CLICK_ZONE_RATIO = 0.3;

export function useReaderHotkeys(inputs: {
  containerRef: Ref<HTMLElement | null>;
  prevPage: () => void;
  nextPage: () => void;
  toggleControls: () => void;
}) {
  const { containerRef, prevPage, nextPage, toggleControls } = inputs;

  function onKeydown(e: KeyboardEvent) {
    const { key } = e;
    if (key === "ArrowLeft" || key === "PageUp" || key === "a" || key === "A") {
      e.preventDefault();
      prevPage();
    } else if (
      key === "ArrowRight" ||
      key === "PageDown" ||
      key === "d" ||
      key === "D"
    ) {
      e.preventDefault();
      nextPage();
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    if (e.deltaY < 0) {
      prevPage();
    } else if (e.deltaY > 0) {
      nextPage();
    }
  }

  function onClick(e: MouseEvent) {
    const container = containerRef.value;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    if (relX < CLICK_ZONE_RATIO) {
      prevPage();
    } else if (relX > 1 - CLICK_ZONE_RATIO) {
      nextPage();
    } else {
      toggleControls();
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", onKeydown);
    const container = containerRef.value;
    if (container) {
      container.addEventListener("wheel", onWheel, { passive: false });
    }
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown);
    const container = containerRef.value;
    if (container) {
      container.removeEventListener("wheel", onWheel);
    }
  });

  return { onClick };
}
