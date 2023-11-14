<template>
  <div class="home-view">
    <div class="content">
      <header class="header">

        <section class="hero-section section-divider">
          <div class="hero-content">
            <h1>StrappMarket</h1>
          </div>
        </section>

        <div class="header-banner">
          <div class="banner-images" ref="bannerImages">
            <img v-for="(image, index) in bannerImages" :src="image" :key="index" />
          </div>
        </div>
      </header>
      <!-- Sections: Hero, Featured Products, How It Works -->
      <section class="how-it-works section-divider">
        <h4>How It Works</h4>
        <div class="steps">
          <div class="step">
            <div class="step-icon">1</div>
            <h3><span class="icon">&#10004;</span> Create an Account</h3>
            <router-link to="/Register" class="Register">Sign up and join our marketplace community.</router-link>
          </div>
          <div class="step">
            <div class="step-icon">2</div>
            <h3><span class="search-icon">&#128269;</span> Discover Products</h3>
            <p>Browse through a wide range of products.</p>
          </div>
          <div class="step">
            <div class="step-icon">3</div>
            <h3><span class="icon">&#128722;</span> Make a Purchase</h3>
            <p>Buy products securely from trusted sellers.</p>
          </div>
        </div>
      </section>
      <section class="featured-products section-divider">
        <h2>Featured Products</h2>
        <div class="product-list" v-if="!productsLoading">
          <!-- Display featured products with images, titles, and prices -->
          <ProductCard v-for="product in top3" :key="product.productID" :product="product" class="product-card" />
        </div>
        <div v-else>Loading...</div>
        <br>
        <router-link to="/ProductList" class="explore-button">Explore Now</router-link>
      </section>
      <section class="noticeCarousel">
        <h2>Notices</h2>
        <notice-carousel></notice-carousel>
      </section>   
    </div>
  </div>
</template>

<script>
import NoticeCarousel from './Notices/NoticeCarousel.vue';
import {firebase} from '@/firebase/index.js'
import {doc, getDoc, getDocs, collection, query} from 'firebase/firestore';
import ProductCard from '../components/Products/ProductCard.vue'

export default {
  name: "HomePage",
  data() {
    return {
      featuredProducts: [{},{},{}],
      bannerImages: [
        require('@/assets/banner1.png'),
        require('@/assets/banner2.png'),
        // Add more banner images here
      ],
      currentBannerIndex: 0,
      productsLoading: false,
      topProducts:[],
      top3:[]
    };
  },
  created() {
    this.startBannerRotation();
  },
  async mounted(){
    if (this.$store.state.user) {
    const userRef = doc(firebase, 'users', this.$store.state.user.uid)
    const updatedUserDoc = await getDoc(userRef);
    this.$emit('user-updated', updatedUserDoc.data());
    this.$store.dispatch('updateUser', updatedUserDoc.data());
    }
    this.loadTopProducts()
  },
  methods: {
    startBannerRotation() {
      setInterval(() => {
        if (!this.isAnimating) {
          this.isAnimating = true;
          this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerImages.length;
          const offset = -this.currentBannerIndex * 100;
          // Use $nextTick to ensure the element is available in the DOM
          this.$nextTick(() => {
            const bannerImages = this.$refs.bannerImages;
            if (bannerImages) {
              bannerImages.style.transform = `translateX(${offset}%)`;
              bannerImages.style.transition = 'transform 0.5s ease';
              // Reset animation state after the transition duration
              setTimeout(() => {
                this.isAnimating = false;
              }, 500);
            }
          });
        }
      }, 5000);
    },
    async loadTopProducts(){
      this.productsLoading = true;
      const prodList = collection(firebase, 'products')
      const q = query(prodList)
      //.orderBy('FeaturePoints', 'desc')
      const snap = await getDocs(q)
      let i = 0
      if (snap.size > 0) {
        while (i < snap.size) {
          this.topProducts.push(snap.docs.map(doc => doc.data())[i])
          i++
        }
      }
      for (let i = 1; i < this.topProducts.length; i++) {
        let currentValue = this.topProducts[i]
        let j
        for (j = i - 1; j >= 0 && this.topProducts[j].FeaturePoints > currentValue.FeaturePoints; j--) {
          this.topProducts[j + 1] = this.topProducts[j]
        }
        this.topProducts[j + 1] = currentValue
      }
      const arrSize = this.topProducts.length
      this.top3.push(this.topProducts[arrSize-1])
      this.top3.push(this.topProducts[arrSize-2])
      this.top3.push(this.topProducts[arrSize-3])
      this.productsLoading = false;
      console.log("top products",this.topProducts)
      console.log("top 3 products",this.top3)
    },
  },
  components: { NoticeCarousel,ProductCard },
};
</script>

<style scoped>
@font-face {
  font-family: 'YourCustomFontName';
  src: url('@/assets/Super-Cool-Personal-Use.woff') format('woff'); /* Update the path */
  font-weight: normal;
  font-style: normal;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.notice-section {
  background-color: #ffffff; /* Set the background color for the notices section */
  padding: 60px 0; /* Adjust padding as needed */
  text-align: center;
}
.noticeCarousel {
  background: linear-gradient(45deg, #8f58a4, #9584cc);
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
h2 {
  font-size: 40px;
  margin-bottom: 20px;
  font-family: '@/assets/Super-Cool-Personal-Use.woff', Impact; /* Use the custom font and fallback to sans-serif */
  color: #53477a; /* Purple */
  animation: fadeIn ease 0.75s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
h4 {
  color: #53477a; /* Purple */
}
.section-divider {
  border-top: 2px solid #ccc; /* Shaded gray line as a divider */
  padding: 40px 0; /* Adjusted vertical padding between sections */
  margin-bottom: 20px; /* Add some space below the divider */
  background: #f1facd; /* Lilac */
}
.content {
  padding: auto; /* Reduced padding for a more compact layout */
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* GLOBAL STYLES */
* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif; /* Let's use Roboto as the default font */
  margin: 0;
  padding: 0;
}

body {
  line-height: 1.5;
}

a {
  text-decoration: none;
}

/* HEADER */
.header-banner {
  width: 100%;
  overflow: hidden;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.banner-images {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  transition: transform 0.5s ease; /* Add a smooth transition here */
  animation: fadeIn ease 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.banner-images img {
  flex-shrink: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
  animation: fadeIn ease 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* MAIN CONTENT */
.content {
  padding: auto;
  animation: fadeIn ease 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* HERO SECTION */
.hero-section {
  background-size: cover;
  background-color: #aff2fe;
  background-position: center;
  text-align: center;
  padding: 5px 0; /* Reduced vertical padding */
  animation: fadeIn ease 0.7s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.hero-content h1 {
  font-size: 60px;
  margin-bottom: 20px;
  font-family: '@/assets/Super-Cool-Personal-Use.woff', Impact; /* Use the custom font and fallback to sans-serif */
  color: #53477a; /* Purple */
  animation: fadeIn ease 0.75s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}


.explore-button {
  background-color: #8b47a5; /* Purple */
  color: #ffffff;
  margin-top: 50px; /* Adjust the margin to move the button further down */
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  animation: fadeIn ease 1.2s;
  animation-iteration-count: 1;
  text-align: center;
  animation-fill-mode: forwards;
}


.explore-button:hover {
  background-color: #53477a; /* Lilac */
}

/* FEATURED PRODUCTS */.featured-products {
  background-color: #be7efa;
  padding: 60px 0 30px; /* Adjust the top padding to move the section and the button down */
  text-align: center;
  animation: fadeIn ease 1.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.featured-products h2{
  font-size: 40px;
  margin-bottom: 20px;
  font-family: '@/assets/Super-Cool-Personal-Use.woff', Impact; /* Use the custom font and fallback to sans-serif */
  color: #ffffff; /* Purple */
  animation: fadeIn ease 0.75s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.product-list {
  display: flex;
  justify-content: space-between; /* Adjusted spacing between products */
  flex-wrap: wrap;
  gap: 10px;
  animation: fadeIn ease 0.7s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.product-card {
  flex-basis: calc(33.33% - 20px); /* Reduced spacing between product cards */
  background-color: #fff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  animation: fadeIn ease 0.65s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.product-card img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  animation: fadeIn ease 0.4s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.view-details {
  color: #007bff;
  transition: color 0.3s ease;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.view-details:hover {
  color: #0056b3;
}

/* HOW IT WORKS */
.how-it-works {
  padding: 40px 0; /* Reduced vertical padding */
  background-color: #f6affe;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.how-it-works h4 {
  font-size: 40px;
  margin-bottom: 20px;
  font-family: '@/assets/Super-Cool-Personal-Use.woff', Impact; /* Use the custom font and fallback to sans-serif */
  color: #53477a; /* Purple */
  animation: fadeIn ease 0.75s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.steps {
  display: flex;
  justify-content: space-between; /* Adjusted spacing between steps */
  margin: 0 auto;
  gap: 20px;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.step {
  flex-basis: calc(33.33% - 20px); /* Reduced spacing between steps */
  padding: 20px;
  background-color: #f6f6f6;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.step-icon {
  font-size: 36px;
  margin-bottom: 20px;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* RESPONSIVE BREAKPOINTS */
/* Adjust the product cards for smaller screens */
@media (max-width: 768px) {
  .product-card {
    flex-basis: calc(50% - 20px);
  }
}

@media (max-width: 576px) {
  .product-card {
    flex-basis: 100%;
  }

  .steps {
    flex-direction: column;
  }

  .step {
    margin-bottom: 20px;
    flex-basis: auto;
  }
}
</style>
