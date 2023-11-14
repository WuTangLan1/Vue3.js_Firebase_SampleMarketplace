<template>
  <div class="body">
    <transition name="fade" mode="out-in">
      <LoginComp v-if="!isAdminAuthenticated" key="loginComp"/>
      <div v-else class="admin-container" key="adminContainer">
        <DashboardHeader/>
        <div class="carousel-wrapper">
          <button class="carousel-btn prev-btn" @click="previousComponent">◀</button>
          <div class="carousel-content">
            <transition :name="transitionName">
              <component :is="currentComponent" class="carousel-item"></component>
            </transition>
          </div>
          <button class="carousel-btn next-btn" @click="nextComponent">▶</button>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
import LoginComp from "@/components/login/logincomp.vue";
import usersShort from "@/components/users/usersShortcut.vue";
import commsDash from "@/components/communities/commsDashboard.vue";
import noticeShort from "@/components/notices/noticesShortcut.vue";
import productShort from "@/components/products/productsShortcut.vue";
import transShort from '@/components/transactions/transShortcut.vue';
import DashboardHeader from "@/components/DashboardHeader.vue"
import { mapState } from "vuex";

export default {
  name: 'HomePage',
  components: {
    LoginComp,
    usersShort,
    commsDash,
    DashboardHeader,
    noticeShort,
    productShort,
    transShort
  },
  data() {
    return {
      currentComponentIndex: 0,
      transitionName: 'slide'
    };
  },
  computed: {
    ...mapState({
      isAdminAuthenticated: state => state.adminuser !== null
    }),
    currentComponent() {
      return this.carouselComponents[this.currentComponentIndex];
    },
    carouselComponents() {
      return [
        'usersShort',
        'commsDash',
        "productShort",
        "noticeShort",
        "transShort"
        // add the other components mate
      ];
    }
  },
  methods: {
    nextComponent() {
      this.transitionName = 'slide';
      this.currentComponentIndex++;
      if (this.currentComponentIndex >= this.carouselComponents.length) {
        this.currentComponentIndex = 0;
      }
    },
    previousComponent() {
      this.transitionName = 'slide-reverse';
      this.currentComponentIndex--;
      if (this.currentComponentIndex < 0) {
        this.currentComponentIndex = this.carouselComponents.length - 1;
      }
    }
}
}
</script>

<style scoped>


.admin-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #FAFAFA;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.carousel-item {
  width: 860px; 
  height: 530px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 2rem 0;
  background: #FFF;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-content {
  flex: 1;
  display: flex;        /* Add this */
  justify-content: center; /* Add this */
  align-items: center;     /* Add this if you want vertical centering as well */
  overflow-x: hidden; 
  padding: 1rem 0;
}

.carousel-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #007BFF;
  transition: color 0.3s;
}

.carousel-btn:hover {
  color: #0056b3;
}

.prev-btn {
  margin-right: 1rem;
}

.next-btn {
  margin-left: 1rem;
}

/* 3D flip transition */
.body {
  perspective: 1500px;
  min-height: 500px;
}

.fade-enter-active, .fade-leave-active {
  transition: transform 1s;
  transform-style: preserve-3d;
  position: absolute;  /* Ensures components overlap during transition */
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  backface-visibility: hidden; /* Hide the back face during the flip */
}

.fade-enter {
  transform: rotateY(90deg);
}

.fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  transform: rotateY(-90deg);
}
/* Common */
.slide-enter-active, .slide-leave-active,
.slide-reverse-enter-active, .slide-reverse-leave-active {
  transition: transform 0.5s, opacity 0.5s, scale 0.5s;
}

/* Slide-in from the right transition */
.slide-enter {
  transform: translateX(100%);
  opacity: 0.5;
  scale: 0.95;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0.5;
  scale: 0.95;
}

/* Slide-out to the left transition */
.slide-reverse-enter {
  transform: translateX(-100%);
  opacity: 0.5;
  scale: 0.95;
}

.slide-reverse-leave-to {
  transform: translateX(100%);
  opacity: 0.5;
  scale: 0.95;
}

</style>