<template>
  <div class="notifications-view">
    <div class="carousel-wrapper">
      <button @click="prevSlide" class="carousel-btn prev-btn">←</button>
      <div class="carousel-content">
        <transition :name="transitionName">
          <component :is="currentComponent" class="carousel-item"></component>
        </transition>
      </div>
      <button @click="nextSlide" class="carousel-btn next-btn">→</button>
    </div>
  </div>
</template>

<script>
import MyNotifications from '@/components/Notifications/MyNotifications.vue';
import MyOffers from '@/components/Offers/MyOffers.vue';

export default {
  components: {
    MyNotifications,
    MyOffers
  },
  data() {
    return {
      currentIndex: 0,
      transitionName: 'slide'
    };
  },
  computed: {
    currentComponent() {
      return this.carouselComponents[this.currentIndex];
    },
    carouselComponents() {
      return ['MyOffers', 'MyNotifications'];
    }
  },
  methods: {
    nextSlide() {
      this.transitionName = 'slide';
      this.currentIndex = (this.currentIndex + 1) % this.carouselComponents.length;
    },
    prevSlide() {
      this.transitionName = 'slide-reverse';
      this.currentIndex = (this.currentIndex - 1 + this.carouselComponents.length) % this.carouselComponents.length;
    }
  }
}
</script>

<style scoped>

.notifications-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #FAFAFA;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  perspective: 1500px;  /* For 3D flip transition */
  min-height: 500px;
  flex : 1;
}

.carousel {
  overflow: hidden;
  width: 85vw;
  height: calc(100vh - 50px);
}

.carousel-content {
  flex-grow: 1;
  display: flex;
  justify-content: center; 
  align-items: center; 
  transition: transform 0.5s ease-in-out;
  width: 200%; 
  padding: 1rem 0;
}

.carousel-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  background: none;
  font-size: 2rem;
  transition: color 0.3s;
  color: #007BFF;
}

.carousel-btn:hover {
  color: #0056b3;
}

.carousel-item {
  width: 860px; 
  height: 530px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 1rem;
  margin: 2rem 0;
  background: #FFF;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden; 
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.fade-enter-active, .fade-leave-active {
  transition: transform 1s;
  transform-style: preserve-3d;
  position: absolute;
}

.fade-enter, .fade-leave-to {
  backface-visibility: hidden;
}

.fade-enter {
  transform: rotateY(90deg);
}

.fade-leave-to {
  transform: rotateY(-90deg);
}

.slide-enter-active, .slide-leave-active,
.slide-reverse-enter-active, .slide-reverse-leave-active {
  transition: transform 0.5s, opacity 0.5s, scale 0.5s;
}

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
