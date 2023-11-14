
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Login from '../components/Users/Login/LoginComponent.vue'
import Register from '../components/Users/Register/RegisterComponent.vue'
import ProductList from '../components/Products/ProductList.vue'
import transaction from '../components/Transactions/TransactionConfirm.vue'
import transactionAccepted from '../components/Transactions/TransactionAccepted.vue'
import transactionRejected from '../components/Transactions/TransactionRejected.vue'
import userOther from '../components/Users/UserOther.vue'
import ReviewsRead from '../components/Users/Reviews/ReviewsRead.vue'
import reviewWrite from '../components/Users/Reviews/ReviewWrite.vue'
import ProductItem from '../components/Products/ProductItem.vue'
import ProductUpload from '../components/Products/ProductUpload.vue'
import RenderNotice from '../components/Notices/RenderNotice.vue'
import CreateNotice from '../components/Notices/CreateNotice.vue'
import NoticeCarousel from '../components/Notices/NoticeCarousel.vue'
import ManageNotice from '../components/Notices/ManageMyNotices.vue'
import ProfileDashboardView from '../views/ProfileDashboardView.vue'
import ProductCard from '../components/Products/ProductCard.vue'
import ProductUpdate from '../components/Products/ProductUpdate.vue'
import Ratings from '../components/Users/Reviews/MyReviews.vue'
import NotificationsView from '../views/NotificationsView.vue'
import SingleOffer from '../components/Offers/SingleOfferView.vue'
import transactionCredits from '../components/Transactions/TransactionCredits.vue'


const routes = [
  { //Copy Nels' code over
    name: 'Home',
    path:'/',
    component: Home,
    props: true,
    //children : 
  },
  {
    name: 'SingleOfferView',
    path: '/SingleOffer/:id',
    component: SingleOffer,
    props:true
  },
    {
      path : '/ProductFeatureDetails/:id',
      name : 'ProductFeatureDetails',
      component : ProductItem,
      props: true
    },
    {
      path : '/ProductUpdate/:prodId',
      name : 'ProductUpdate',
      component : ProductUpdate,
      props : true
    },
  { 
    name: 'ProductList',   
    path:'/ProductList',
    component: ProductList ,
    children : [
        {
          path : '/ProductItem/:id',
          name :'ProductItem',
          props: {
            id: {
              required: true
            }},
          component : ProductItem,
        }
                ]
  },

  { 
    name: 'TransactionPage',
    path: '/TransactionPage',
    component: transaction,
    props: (route) => ({
      productData: route.query.productData
    }),
    children : [
      { //See above
        name: 'TransactionAccepted',
        path:'/TransactionAccepted',
        component: transactionAccepted
      },
      { //See above
        name: 'TransactionRejected',
        path:'/TransactionRejected',
        component: transactionRejected
      }
    ]
  },

  {
    name: 'TransactionCredits',
    path:'/Payment/:offerId',
    component: transactionCredits,
    props: true
  },


  { //Basic page, might need some work?
    name: 'AboutSite',
    path:'/About',
    component: About
  },
  { //Needs to be spun up based on Leo's codebase sans firebase
    name: 'RegisterView',
    path:'/Register',
    component: Register
  },
  { //see above
    name: 'LoginView',
    path:'/Login',
    component: Login
  },
  {
    name: 'UserMe',
    path:'/profile',
    component: ProfileDashboardView
  },
  {
    name: 'Ratings',
    path:'/reviews',
    component: Ratings,
  },
  { 
    name: 'ReviewsRead',
    path:'/:id',
    component: ReviewsRead,
    props:true,
  },
  { 
    name: 'ReviewWrite',
    path:'/:id',
    component: reviewWrite,
    props:true,
  },
  {
    name: 'UserOther',
    path:'/UserProfile/:id',
    component: userOther,
    props:true,
  },
  {
   
    name: "ProductUpload",
    path:"/upload",
    component : ProductUpload
  },
  {
    name : "NoticeTest",
    path: "/TestPathA",
    component : RenderNotice
  },
  {
    name: "NoticeCreate",
    path: "/CreateNotice",
    component: CreateNotice
  },
  {
    name: "NoticeCarousel",
    path:"/carouselTest",
    component: NoticeCarousel
  },
  {
    name: "ManageNotices",
    path: "/ManageNotices",
    component: ManageNotice
  },
  {
    name: "ProdCardTest",
    path: "/ProdCardTest",
    component: ProductCard
  },
  {
    name: "NotificationsView",
    path: "/NotificationsView",
    component: NotificationsView
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
