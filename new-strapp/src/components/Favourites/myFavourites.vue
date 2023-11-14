<template>
  <div>
    <div v-if="loading"><loader/></div>
    <div v-else>
      <product-card v-for="product in displayedFavourites" :key="product.id" :product="product"></product-card>

      <!-- Pagination Controls -->
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="page === 1">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from '@/firebase/index.js';
import ProductCard from '@/components/Products/ProductCard.vue';
import { doc, getDoc } from 'firebase/firestore';
import loader from '../LoaderIcon.vue'

export default {
  name: 'MyFavourites',
  components: {
    ProductCard, loader
  },
  data() {
    return {
      loading: true,
      favouriteProducts: [],
      page: 1,
      perPage: 2,
      totalPages: 0 // Will be computed based on the favorite products length
    };
  },
  computed: {
    displayedFavourites() {
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return this.favouriteProducts.slice(start, end);
    }
  },
  methods: {
    async prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    async nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
      }
    }
  },
  async mounted() {
    try {
      const currentUser = await this.$store.getters.thisUser;
      const userUID = currentUser.uid;

      if (!userUID) {
        console.error("No user UID provided!");
        return;
      }

      const userDocRef = doc(firebase, 'users', userUID);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists) {
        const favorites = userDoc.data().favorites;

        for (let i = 1; i < favorites.length; i++) { // Start from index 1 to skip the value at index 0
          const productID = favorites[i];
          const productDocRef = doc(firebase, 'products', productID);
          const productDoc = await getDoc(productDocRef);

          if (productDoc.exists) {
            const product = productDoc.data();
            this.favouriteProducts.push(product);
          }
        }
        
        // Update the totalPages after fetching all favourite products
        this.totalPages = Math.ceil(this.favouriteProducts.length / this.perPage);
      } else {
        console.error("User document doesn't exist");
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
h2 {
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

div[loading] {
  font-size: 1.2em;
  color: #777;
  text-align: center;
  margin-top: 20px;
}

product-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
}

product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Pagination Controls Styling */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px; /* space between elements */
}

.pagination-controls button {
  padding: 10px 20px;
  border: none;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-controls button:hover {
  background-color: #555;
}

.pagination-controls button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.pagination-controls span {
  font-weight: 600;
}
</style>
