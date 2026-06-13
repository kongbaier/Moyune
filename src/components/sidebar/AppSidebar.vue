<script setup lang="ts">
import { Book, Settings, Sun, Moon } from "@lucide/vue";
import { markRaw, ref, type Component } from "vue";
import SidebarItem from "./SidebarItem.vue";

const items: { to: string; label: string; icon: Component }[] = [
  { to: "/", label: "书架", icon: markRaw(Book) },
  { to: "/settings", label: "设置", icon: markRaw(Settings) },
];

/** 当前是否为深色模式 */
const isDark = ref(document.documentElement.classList.contains("dark"));

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}
</script>

<template>
  <aside
    class="w-60 px-2 py-6 flex flex-col justify-between border-r border-border bg-surface-elevated theme-transition"
  >
    <header>
      <h1 class="text-4xl font-serif text-text-primary">阅读</h1>
      <p class="text-xs text-text-muted mt-1">一个第三方的开源阅读 Web 应用</p>
    </header>

    <nav class="flex-1 mt-4">
      <ul class="space-y-1 text-sm">
        <SidebarItem v-for="item in items" :key="item.to" :item="item" />
      </ul>
    </nav>

    <footer class="space-y-3">
      <button
        class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-hover cursor-pointer w-full"
        @click="toggleTheme"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <component :is="isDark ? Sun : Moon" class="size-4" />
        <span>{{ isDark ? "浅色模式" : "深色模式" }}</span>
      </button>
      <p class="text-xs text-text-muted">一个开源项目，欢迎贡献代码</p>
    </footer>
  </aside>
</template>
