import { createRouter, createWebHistory } from 'vue-router';
import LoginComp from '../components/login/logincomp.vue';
import HomeView from '../components/HomePage.vue';
import CommView from '../views/CommsView.vue';
import ProdView from '../views/ProductsView.vue';
import UserView from '../views/UsersView.vue';
import ProdInfoView from '../views/ProductInfoView.vue'
import LoadAdminView from '../views/LoadAdminView'


const routes = [
   {
       name: 'LoginView',
       path: '/login',
       component: LoginComp
   },
   {
       name: 'HomePage',
       path: '/',
       component: HomeView
   },
   {
        name : 'CommsView',
        path: '/CommsView/:commId',
        component : CommView,
        props: true
   },
   {
        name : 'UsersView',
        path: '/UsersView/:uid',
        component : UserView,
        props : true
   },
   {
        name : 'ProductsView',
        path: '/ProductsView',
        component : ProdView
   },
   {
     name : 'LoadAdminView',
     path: '/LoadAdminView',
     component : LoadAdminView
   },
   {
     name : 'ProductInfoView',
     path: '/ProductInfoView/:prodId',
     component : ProdInfoView,
     props : true
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes
});

export default router;
