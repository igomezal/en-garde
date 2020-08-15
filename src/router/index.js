import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue';
import AuthenticationPage from '../views/AuthenticationPage'

Vue.use(VueRouter)

let history = [];

const routes = [
  {
    path: '/',
    name: 'Login',
    component: AuthenticationPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfilePage.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    redirect: '/dashboard',
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if(to.name === 'Dashboard') {
    history = [];
  } else if(!to.params.back) {
    if(from.name) history.push(from.name);
  }

  next();
});

router.goBack = () => {
  if(history.length === 0) {
    if(router.currentRoute.name !== 'Dashboard') {
      router.push({ name: 'Dashboard' });
    }
  } else {
    router.push({ name: history.pop(), params: { back: true }});
  }
}

export default router
