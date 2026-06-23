import { watch } from "vue";
import {
  baseUrl,
  port,
  fullUrl,
  getDefaultBaseUrl,
  getDefaultPort,
  isProduction,
  STORAGE_KEY_BASE_URL,
  STORAGE_KEY_PORT,
} from "./config";

watch([baseUrl, port], () => {
  if (isProduction()) {
    localStorage.setItem(STORAGE_KEY_BASE_URL, baseUrl.value);
    localStorage.setItem(STORAGE_KEY_PORT, port.value);
  }
});

export function useAppConfig() {
  function resetToDefaults() {
    baseUrl.value = getDefaultBaseUrl();
    port.value = getDefaultPort();
  }

  return {
    baseUrl,
    port,
    fullUrl,
    isProduction: isProduction(),
    resetToDefaults,
  };
}
