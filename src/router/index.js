import { createRouter, createWebHistory } from 'vue-router';

// View Components
import HomePage from '../views/HomePage.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
