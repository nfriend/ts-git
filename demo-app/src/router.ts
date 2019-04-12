import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import UnderConstruction from './views/UnderConstruction.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'under-construction',
      component: UnderConstruction,
    },
    {
      path: '/dev',
      name: 'dev',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
  ],
});
