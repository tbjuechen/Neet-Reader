import { createRouter, createWebHashHistory, Router } from 'vue-router'

const router:Router = createRouter({
  history: createWebHashHistory(),
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
