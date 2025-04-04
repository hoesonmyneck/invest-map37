import type { RouteRecordRaw } from "vue-router";
import { LoginPage } from './auth';
import { useAuthStore } from '../stores/auth.store';

const authGuard = (to: any, from: any, next: any) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    
    next('/login');
  } else {
    next();
  }
};

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/",
    name: "main",
    component: () => import("./../pages/main/ui/MainPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

export { authGuard };
