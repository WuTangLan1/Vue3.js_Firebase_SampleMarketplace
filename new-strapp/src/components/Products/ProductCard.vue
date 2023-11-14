<template>
  <div class="glowing-container" v-if="calcIfGlow()" :style="glowStyle">
    <div class="ProductCard">
      <!-- Top Section -->
      <div class="top-section">
        <!-- Left Section -->
        <div class="left-section">
          <h2>{{ product.Title }}</h2>
          <div class="info-container price">R{{ product.Price }}</div>
          <div class="info-container last-updated">
            Last Updated: <br>{{ formatDate(product.LastEditDate) }}
          </div>
        </div>

        <!-- Right Section -->
        <div class="right-section">
          <img :src="product.ProductImages[0]" alt="Product Image" class="product-img">
              <!-- <div v-if="!product.isAvailable" class="sold-label">Sold</div> -->
        </div>
        <div class="views">{{ product.FeaturePoints }} FP</div>
          
      </div>

      <!-- Bottom Section -->
      <div class="bottom-section">
        <div class="uploader">{{ product.uploader_username }}</div>
        <!-- See More Button -->
        <button class="action-button see-more" @click="navigateRouterPush()">See More</button>
        <!-- Favorite Button -->
        <button @click="toggleFavorite" class="heart-button">
  <span v-if="isFavorite && $store.state.user">❤️</span>
  <span v-if="!isFavorite && $store.state.user">🤍</span>
</button>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="ProductCard">
      <!-- Top Section -->
      <div class="top-section">
        <!-- Left Section -->
        <div class="left-section">
          <h2>{{ product.Title }}</h2>
          <div class="info-container price">R{{ product.Price }}</div>
          <div class="info-container last-updated">
            Last Updated: <br>{{ formatDate(product.LastEditDate) }}
          </div>
        </div>

        <!-- Right Section -->
        <div class="right-section">
          <img :src="product.ProductImages[0]" alt="Product Image" class="product-img">
              <!-- <div v-if="!product.isAvailable" class="sold-label">Sold</div> -->
        </div>
          <div class="views">{{ product.FeaturePoints }} FP</div>
          
      </div>

      <!-- Bottom Section -->
      <div class="bottom-section">
        <div class="uploader">{{ product.uploader_username }}</div>
        <!-- See More Button -->
        <button class="action-button see-more" @click="navigateRouterPush()">See More</button>
        <!-- Favorite Button -->
        <button @click="toggleFavorite" class="heart-button">
          <span v-if="isFavorite && $store.state.user">❤️</span>
  <span v-if="!isFavorite && $store.state.user">🤍</span>
</button>
      </div>
    </div>
  </div>
</template>

<script>
import { updateDoc, doc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';
export default {
  data() {
    return {
      productRef: '',
      views: 0,
      isFavorite: false // Initially not favorited
    };
  },
  props: {
    product: {
      type: Object,
      default: () => ({
        AvailableQntty: 1,
        Description: 'TEST',
        FeaturePoints: 0,
        LastEditDate: '2023-09-12T11:05:31.905Z',
        Price: 5000,
        ProductImages: [
          'https://firebasestorage.googleapis.com/v0/b/tryout-8be09.appspot.com/o/images%2F4a376710-515c-11ee-a0c7-4b6df8a7e589?alt=media&token=2e21f9a4-90c9-4b11-95a7-84464e893f02',
          'https://firebasestorage.googleapis.com/v0/b/tryout-8be09.appspot.com/o/images%2F4c3cfb10-515c-11ee-a0c7-4b6df8a7e589?alt=media&token=9811a881-09e1-47c3-b85d-be052a302089'
        ],
        Title: 'Default',
        UploadDate: '2023-09-12T11:05:31.905Z',
        categoryId: '3uHu9k9DDQcneQ3BuiuC',
        category_title: 'Creative',
        communityId: '64fg4wDwpgxrNb2eAJpN',
        community_title: 'Stellenbosch',
        conditions: ['Like Brand New', 'No Scratches'],
        isAvailable: true,
        productID: '7b6160c051d4-11ee-8d53-7b960776f64d',
        uploaderUID: 'OUSVIST19rVNF5zMkoHdntsl51s2',
        uploader_username: 'JimmyJ'
      })
    }
  },
    methods: {
    formatDate(dateString) {
      const now = new Date();
      const then = new Date(dateString);
      const differenceInMs = now - then;
      const differenceInSeconds = Math.floor(differenceInMs / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const differenceInDays = Math.floor(differenceInHours / 24);
      if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minute(s) ago`;
      } else if (differenceInHours < 24) {
        return `${differenceInHours} hour(s) ago`;
      } else {
        return `${differenceInDays} day(s) ago`;
      }
    },
    calcIfGlow() {
      return this.product.FeaturePoints >= 100;
    },
    calcGlowIntensity() {
      //return this.product.FeaturePoints /180; // Change multiplier as per your need
      return 10
    },
    navigateRouterPush() {
      console.log(this.product.productID)
      const id = this.product.productID;
      this.$router.push({ name: 'ProductFeatureDetails', params: { id: id } });
    },
    async toggleFavorite() {
      //check if user is logged in
      if (this.$store.state.user){
        //check this.isFavorite
        if (this.isFavorite) {
          //true means we're toggling to false
          //remove the favorited item from the favorites array and push to database
          let favlist = this.$store.state.user.favorites
          const index = favlist.indexOf(this.product.productID)
          favlist.splice(index,1)
          const userRef = doc(firebase, 'users', this.$store.state.user.uid);
          await updateDoc(userRef, {favorites:favlist});
          //console.log(removeResponse)
          //fp update -
        } else {
          //false means we're toggling to true
          //add this item to favorites array and push new array
          let favlist = this.$store.state.user.favorites
          favlist.push(this.product.productID)
          const userRef = doc(firebase, 'users', this.$store.state.user.uid);
          await updateDoc(userRef, {favorites:favlist});
          //fp update +
        }
        //toggling behavior for UI
        this.isFavorite = !this.isFavorite;
        this.$emit('favorite-toggled', {
          productId: this.product.productID,
          favorite: this.isFavorite
        });
      }
    },
  },
  computed: {
    glowStyle() {
      const intensity = this.calcGlowIntensity();
      return {
        'box-shadow': `0 0 ${intensity}px #7e3d88, 0 0 ${intensity / 2}px #4d64e4, inset 0 0 ${intensity}px #7e3d88`
      };
    }
  },
  mounted() {
      //check if logged in
      if (!this.$store.state.user) {
        return
      }
      //check if favourited already
      this.isFavorite = this.$store.state.user.favorites.includes(this.product.productID)
    }
};
</script>

<style scoped>
.ProductCard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
  padding: 20px;
  border: 2px solid #d1d1d1;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.views {
  margin-top: 10px;
  font-size: 14px;
  color: #9e00b3;
  animation: fadeIn ease 1s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.right-section {
  flex: 2;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.product-img {
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 200px;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  aspect-ratio: 5/5;
}

.glowing-container {
  border-radius: 10px;
  box-shadow: 0 0 20px #7e3d88, 0 0 10px #4d64e4, inset 0 0 10px #7e3d88;
  animation: pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 15px #7e3d88, 0 0 5px #4d64e4, inset 0 0 5px #7e3d88;
  }
  25% {
    box-shadow: 0 0 25px #7e3d88, 0 0 15px #4d64e4, inset 0 0 17px #7e3d88;
  }
  50% {
    box-shadow: 0 0 15px #7e3d88, 0 0 5px #4d64e4, inset 0 0 5px #7e3d88;
  }
  75% {
    box-shadow: 0 0 25px #7e3d88, 0 0 15px #4d64e4, inset 0 0 15px #7e3d88;
  }
  100% {
    box-shadow: 0 0 15px #7e3d88, 0 0 5px #4d64e4, inset 0 0 5px #7e3d88;
  }
}
 .heart-button {
    border: none; /* Remove the border */
    background: none; /* Remove the background */
    font-size: inherit; /* Use the font size of the parent element */
    cursor: pointer; /* Add a pointer cursor for better UX */
    padding: 0; /* Remove any padding */
  }

.action-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #0056b3;
}

.favorite-button {
  background-color: #ff5722;
}

.favorite-button:hover {
  background-color: #d84315;
}

.info-container {
  margin: 5px 0;
  background-color: #f7f7f7;
  padding: 5px 10px;
  border-radius: 8px;
  overflow: hidden;
}

.price,
.last-updated {
  font-weight: bold;
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.see-more {
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.see-more:hover {
  background-color: #0056b3;
}

.uploader {
  margin-right: 10px;
  font-weight: bold;
}
</style>
