import { reactive, computed, watch } from "vue";

const STORAGE_TEXT = "veader:textConfig";
const STORAGE_LAYOUT = "veader:layoutConfig";

function loadConfig<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ------ module-level reactive state (singleton) ------

const textConfig = reactive(
  loadConfig(STORAGE_TEXT, {
    fontSize: 18,
    fontWeight: 400,
    fontFamily: "",
  })
);
textConfig.fontSize = Number(textConfig.fontSize);
textConfig.fontWeight = Number(textConfig.fontWeight);

const layoutConfig = reactive(
  loadConfig(STORAGE_LAYOUT, {
    horizontalPadding: 100,
    verticalPadding: 0,
    spaceing: "5%",
    lineHeight: 1.5,
    paragraphSpacing: 1.2,
    textIndent: 0,
    textSpacing: 0,
  })
);
layoutConfig.horizontalPadding = Number(layoutConfig.horizontalPadding);
layoutConfig.verticalPadding = Number(layoutConfig.verticalPadding);
layoutConfig.lineHeight = Number(layoutConfig.lineHeight);
layoutConfig.paragraphSpacing = Number(layoutConfig.paragraphSpacing);
layoutConfig.textIndent = Number(layoutConfig.textIndent);
layoutConfig.textSpacing = Number(layoutConfig.textSpacing);

const FONT_SIZE_STEPS = [14, 16, 18, 20, 22];

const fontFamilyValue = computed(() => {
  return textConfig.fontFamily || "var(--font-serif)";
});

const fontSizeLabel = computed(() => `${textConfig.fontSize}px`);

function cycleFontScale() {
  const idx = FONT_SIZE_STEPS.indexOf(textConfig.fontSize);
  const next = (idx + 1) % FONT_SIZE_STEPS.length;
  textConfig.fontSize = FONT_SIZE_STEPS[next];
}

function parseSpacingPx(containerWidth: number): number {
  const s = layoutConfig.spaceing;
  if (s.endsWith("%")) {
    return (containerWidth * parseFloat(s)) / 100;
  }
  if (s.endsWith("px")) {
    return parseFloat(s);
  }
  return parseFloat(s) || 0;
}

watch(
  textConfig,
  (v) => {
    localStorage.setItem(STORAGE_TEXT, JSON.stringify(v));
  },
  { deep: true }
);

watch(
  layoutConfig,
  (v) => {
    localStorage.setItem(STORAGE_LAYOUT, JSON.stringify(v));
  },
  { deep: true }
);

/**
 * Reader config composable — manages text/layout settings with localStorage persistence.
 * Module-level singleton: state is shared across all consumers.
 */
export function useReaderConfig() {
  return {
    textConfig,
    layoutConfig,
    fontFamilyValue,
    fontSizeLabel,
    cycleFontScale,
    parseSpacingPx,
  };
}
