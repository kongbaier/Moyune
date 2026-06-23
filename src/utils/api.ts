import ky from "ky";
import { fullUrl } from "../composables/config";
import { watch } from "vue";

export interface ApiResponse<T> {
  data: T;
  errorMsg: string;
  isSuccess: boolean;
}

function resolveBaseUrl(): string | undefined {
  const url = fullUrl.value.replace(/\/+$/, "");
  return url || undefined;
}

function createInstance(baseUrl?: string) {
  return ky.create({
    timeout: 10000,
    ...(baseUrl ? { baseUrl } : {}),
  });
}

let instance = createInstance(resolveBaseUrl());

watch(fullUrl, (url) => {
  const trimmed = url.replace(/\/+$/, "");
  instance = createInstance(trimmed || undefined);
});

export default new Proxy({} as typeof instance, {
  get(_target, prop, _receiver) {
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
