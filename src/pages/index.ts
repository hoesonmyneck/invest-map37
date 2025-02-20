import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'main',
        component: () => import('./../pages/main/ui/MainPage.vue'),

    }
]