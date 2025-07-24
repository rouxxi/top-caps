import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue';
import GamingRoom from './pages/GamingRoom.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
    { path: '/gaming-room/:id', name: '/gaming-room', component: GamingRoom },
    { path: '/',name: '/', component: HomePage },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: NotFound,
        meta: {
          requiresAuth: false
        }
    }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})