import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let history = [];

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "authentication" */ '../views/AuthenticationPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfilePage.vue'),
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import(/* webpackChunkName: "notifications" */ '../views/NotificationsPage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '*',
    redirect: '/dashboard',
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  if(to.name === 'Dashboard') {
    history = [];
  } else if(!to.params.back) {
    if(from.name) history.push(from.name);
  }

  const foundHistoryElement = history.indexOf(to.name);
  if(foundHistoryElement > -1) {
    history.splice(foundHistoryElement, 1);
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
