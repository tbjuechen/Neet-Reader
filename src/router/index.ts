import { createRouter, createWebHistory, Router } from 'vue-router'

const router:Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/MainLayout.vue'),
      children:[
        {
          path:'/shelf/:id',
          name:'shelf',
          component: ()=> import('../views/BookShelf.vue')
        }
      ]
    },
    {
      path:'/book/:id',
      name:'book',
      component: ()=> import('../views/BookReader.vue')
    }
  ]
})

export default router
