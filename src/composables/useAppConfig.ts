import { computed, ref, watch } from "vue";

const STORAGE_KEY_BASE_URL = "moyune:baseUrl";
const STORAGE_KEY_PORT = "moyune:port";

/**
 * 构建完整 API 基础地址（baseUrl + port）
 * @example buildFullUrl("http://192.168.31.217/", "1122") → "http://192.168.31.217:1122/"
 */
function buildFullUrl(base: string, port: string): string {
  if (!base) return "";
  const trimmed = base.replace(/\/+$/, "");
  const hasScheme = /^https?:\/\//i.test(trimmed);
  const host = hasScheme ? trimmed : `http://${trimmed}`;
  if (!port) return host + "/";
  // 移除 host 中已有的端口
  const hostNoPort = host.replace(/:\d+$/, "");
  return `${hostNoPort}:${port}/`;
}

function getDefaultBaseUrl(): string {
  return import.meta.env.VITE_BASE_URL || "";
}

function getDefaultPort(): string {
  return import.meta.env.VITE_PORT || "";
}

function isProduction(): boolean {
  return import.meta.env.PROD;
}

// ------ 模块级响应式状态（单例，全局共享） ------

const savedBaseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL);
const savedPort = localStorage.getItem(STORAGE_KEY_PORT);

const baseUrl = ref<string>(
  isProduction() ? (savedBaseUrl ?? getDefaultBaseUrl()) : getDefaultBaseUrl()
);
const port = ref<string>(
  isProduction() ? (savedPort ?? getDefaultPort()) : getDefaultPort()
);

const fullUrl = computed(() => buildFullUrl(baseUrl.value, port.value));

// 监听变化并持久化（仅生产模式）
watch([baseUrl, port], () => {
  if (isProduction()) {
    localStorage.setItem(STORAGE_KEY_BASE_URL, baseUrl.value);
    localStorage.setItem(STORAGE_KEY_PORT, port.value);
  }
});

/**
 * 应用配置 composable — 提供 API 服务器地址的读写能力
 *
 * - 开发模式：读取 .env.development 中的 VITE_BASE_URL / VITE_PORT
 * - 生产模式：读取 localStorage 中的用户配置，回落至构建时 env 默认值
 */
export function useAppConfig() {
  /** 重置为 env 默认值 */
  function resetToDefaults() {
    baseUrl.value = getDefaultBaseUrl();
    port.value = getDefaultPort();
  }

  return {
    /** 原始 baseUrl（不含端口） */
    baseUrl,
    /** 端口号 */
    port,
    /** 拼接后的完整地址，可直接用于 fetch/axios */
    fullUrl,
    /** 是否为生产模式 */
    isProduction: isProduction(),
    /** 重置为 .env 默认值 */
    resetToDefaults,
  };
}
