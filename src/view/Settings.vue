<script setup lang="ts">
import { useAppConfig } from "../composables/useAppConfig";
import { Globe, RotateCcw, Server } from "@lucide/vue";

const { baseUrl, port, fullUrl, isProduction, resetToDefaults } =
  useAppConfig();
</script>

<template>
  <div class="mx-auto max-w-(--content-max-w) px-10 py-10">
    <h1
      class="text-3xl font-bold tracking-widest text-text-primary"
      style="font-family: var(--font-display)"
    >
      设置
    </h1>

    <section class="mt-8">
      <div class="mb-5 flex items-center gap-2.5">
        <Server :size="18" class="text-text-muted" />
        <h2 class="text-base font-semibold text-text-primary">服务器配置</h2>
      </div>

      <div
        class="rounded-2xl border border-border/50 bg-surface-elevated p-6 paper-texture shadow-ink space-y-5"
      >
        <div
          v-if="!isProduction"
          class="rounded-lg bg-accent-muted/50 px-4 py-3 text-sm text-accent-text/80"
        >
          开发模式下，以下值读取自
          <code class="font-mono text-xs">.env.development</code>
          文件。生产模式下可在本页面直接修改并自动保存。
        </div>
        <div
          v-else
          class="rounded-lg bg-accent-muted/50 px-4 py-3 text-sm text-accent-text/80"
        >
          生产模式下，配置保存于浏览器本地存储。修改后即时生效。
        </div>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-text-secondary">
            服务器地址
          </span>
          <input
            v-model="baseUrl"
            type="text"
            placeholder="http://192.168.31.217"
            class="w-full bg-transparent border-b border-border px-1 py-2.5 text-sm text-text-primary placeholder:text-text-muted/40 outline-none transition-colors focus:border-accent"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-text-secondary"> 端口号 </span>
          <input
            v-model="port"
            type="text"
            placeholder="1122"
            class="w-full bg-transparent border-b border-border px-1 py-2.5 text-sm text-text-primary placeholder:text-text-muted/40 outline-none transition-colors focus:border-accent"
          />
        </label>

        <div class="rounded-lg border border-border/50 bg-surface px-4 py-3">
          <div class="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <Globe :size="12" />
            <span>完整请求地址</span>
          </div>
          <code class="text-sm text-text-primary break-all">
            {{ fullUrl || "（未配置）" }}
          </code>
        </div>

        <button
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          @click="resetToDefaults"
        >
          <RotateCcw :size="14" />
          重置为默认值
        </button>
      </div>
    </section>
  </div>
</template>
