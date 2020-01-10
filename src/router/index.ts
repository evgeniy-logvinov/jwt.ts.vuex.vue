import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  },
  {
    path: '/signup',
    component: () => import(/* webpackChunkName: "marketplace" */ '@/views/SignUpHome.vue'),
    meta: { isPublic: true },
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/SignUp.vue'),
        name: 'signup',
        meta: { isPublic: true },
      },
      {
        path: 'activation/:id',
        component: () => import(/* webpackChunkName: "marketplace" */ '@/views/SignUpActivation.vue'),
        name: 'signupActivation',
        meta: { isPublic: true },
      },
    ],
  },
  {
    path: '/signin',
    name: 'signin',
    meta: { isPublic: true },
    component: () => import(/* webpackChunkName: "signin" */ '@/views/SignIn.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('token') && !to.meta.isPublic) {
    next({
      path: '/signin',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
