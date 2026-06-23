<script setup lang="ts">
import { Book, Settings, Sun, Moon } from "@lucide/vue";
import { markRaw, ref, type Component } from "vue";
import SidebarItem from "./SidebarItem.vue";

const items: { to: string; label: string; icon: Component }[] = [
  { to: "/", label: "书架", icon: markRaw(Book) },
  { to: "/settings", label: "设置", icon: markRaw(Settings) },
];

const isDark = ref(document.documentElement.classList.contains("dark"));

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}
</script>

<template>
  <aside
    class="w-52 px-5 py-8 flex flex-col border-r border-border bg-surface-elevated paper-texture"
  >
    <header class="mb-12">
      <h1
        class="text-4xl leading-tight tracking-widest text-text-primary"
        style="writing-mode: vertical-rl; font-family: var(--font-display)"
      >
        墨韵
      </h1>
      <p
        class="mt-3 text-[11px] leading-relaxed text-text-muted"
        style="writing-mode: vertical-rl"
      >
        开源阅读 · 静读时光
      </p>
    </header>

    <nav class="flex-1">
      <ul class="space-y-0.5 text-sm">
        <SidebarItem v-for="item in items" :key="item.to" :item="item" />
      </ul>
    </nav>

    <footer class="space-y-4">
      <button
        class="group flex items-center gap-2.5 px-3 py-2 text-sm text-text-muted hover:text-text-primary cursor-pointer w-full transition-colors duration-300"
        @click="toggleTheme"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <component :is="isDark ? Sun : Moon" class="size-3.5 shrink-0" />
        <span>{{ isDark ? "浅色" : "深色" }}</span>
      </button>
      <p class="text-[11px] leading-relaxed text-text-muted/50">
        读书不觉已春深<br />一寸光阴一寸金
      </p>
    </footer>
  </aside>
</template>
