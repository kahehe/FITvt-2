import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{requiresAuth:false}
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta:{requiresAuth:false}
  },
  {
    path: '/secret/home',
    name: 'home',
    component: () => import('../views/secret/home.vue'),
    meta:{requiresAuth:true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
