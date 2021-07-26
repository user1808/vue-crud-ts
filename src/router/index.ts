import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CrudView',
    component: () => import(/* webpackChunkName: "crud" */ '../views/CrudView.vue')
  },
  {
    path: '/people',
    name: 'PeopleList',
    component: () => import(/* webpackChunkName: "about" */ '../views/PeopleList.vue')
  },
  {
    path: '/person/:id',
    name: 'PersonDetail',
    props: true,
    component: () => import(/* webpackChunkName: "person-detail" */ '../views/PersonDetail.vue')
  },
  {
    path: '*',
    redirect: '/',
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
