import { computed, ref } from "vue";

const STORAGE_KEY_BASE_URL = "moyune:baseUrl";
const STORAGE_KEY_PORT = "moyune:port";

function buildFullUrl(base: string, port: string): string {
  if (!base) return "";
  const trimmed = base.replace(/\/+$/, "");
  const hasScheme = /^https?:\/\//i.test(trimmed);
  const host = hasScheme ? trimmed : `http://${trimmed}`;
  if (!port) return host + "/";
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

const savedBaseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL);
const savedPort = localStorage.getItem(STORAGE_KEY_PORT);

const baseUrl = ref<string>(
  isProduction() ? (savedBaseUrl ?? getDefaultBaseUrl()) : getDefaultBaseUrl(),
);
const port = ref<string>(
  isProduction() ? (savedPort ?? getDefaultPort()) : getDefaultPort(),
);
const fullUrl = computed(() => buildFullUrl(baseUrl.value, port.value));

export {
  baseUrl,
  port,
  fullUrl,
  buildFullUrl,
  getDefaultBaseUrl,
  getDefaultPort,
  isProduction,
  STORAGE_KEY_BASE_URL,
  STORAGE_KEY_PORT,
};
