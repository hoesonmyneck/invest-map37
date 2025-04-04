import { createRouter, createWebHistory } from "vue-router";
import { routes, authGuard } from "../../pages";

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});


router.beforeEach(authGuard);
