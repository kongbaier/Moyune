import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router/index.ts";

/* ---- 初始化主题（首次渲染无 transition，避免 FOUC）---- */
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
}

/* ---- 主题就绪后，启用过渡动画（此后手动切换即平滑过渡）---- */
requestAnimationFrame(() => {
  document.documentElement.classList.add("theme-ready");
});

const app = createApp(App);
app.use(router);
app.mount("#app");
