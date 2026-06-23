import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../view/Home.vue") },
    { path: "/reader/:bookUrl", component: () => import("../view/Reader.vue") },
    { path: "/settings", component: () => import("../view/Settings.vue") },
  ],
});
