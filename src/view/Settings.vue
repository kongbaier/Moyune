<script setup lang="ts">
import { useAppConfig } from "../composables/useAppConfig";
import { Globe, RotateCcw, Server } from "@lucide/vue";

const { baseUrl, port, fullUrl, isProduction, resetToDefaults } =
  useAppConfig();
</script>

<template>
  <div class="mx-auto max-w-(--content-max-w) p-8">
    <h1 class="text-2xl font-bold text-text-primary">设置</h1>

    <!-- ───────── 服务器配置 ───────── -->
    <section class="mt-8">
      <div class="mb-4 flex items-center gap-2">
        <Server
          :size="20"
          class="text-text-secondary"
        />
        <h2 class="text-lg font-semibold text-text-primary">服务器配置</h2>
      </div>

      <div
        class="rounded-xl border border-border bg-surface-elevated p-6 space-y-5"
      >
        <!-- 配置来源提示 -->
        <div
          v-if="!isProduction"
          class="rounded-lg bg-accent-muted px-4 py-3 text-sm text-accent-text"
        >
          开发模式下，以下值读取自 <code>.env.development</code> 文件。生产模式下可在本页面直接修改并自动保存。
        </div>
        <div
          v-else
          class="rounded-lg bg-accent-muted px-4 py-3 text-sm text-accent-text"
        >
          生产模式下，配置保存于浏览器本地存储。修改后即时生效。
        </div>

        <!-- Base URL -->
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-text-secondary">
            服务器地址
          </span>
          <input
            v-model="baseUrl"
            type="text"
            placeholder="http://192.168.31.217"
            class="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-muted"
          />
        </label>

        <!-- Port -->
        <label class="block space-y-1.5">
          <span class="text-sm font-medium text-text-secondary">
            端口号
          </span>
          <input
            v-model="port"
            type="text"
            placeholder="1122"
            class="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-muted"
          />
        </label>

        <!-- 拼接预览 -->
        <div class="rounded-lg border border-border bg-surface px-4 py-3">
          <div class="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
            <Globe :size="12" />
            <span>完整请求地址</span>
          </div>
          <code class="text-sm text-text-primary break-all">
            {{ fullUrl || "（未配置）" }}
          </code>
        </div>

        <!-- 重置 -->
        <button
          class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover active:bg-surface-active cursor-pointer"
          @click="resetToDefaults"
        >
          <RotateCcw :size="14" />
          重置为默认值
        </button>
      </div>
    </section>
  </div>
</template>
