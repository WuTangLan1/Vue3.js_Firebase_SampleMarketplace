<template>
  <div class="manage-products-container">

    <!-- Search Input -->
    <input v-model="searchTerm" @input="searchProducts" placeholder="Search products..." class="search-input">
    
    <div class="product-cards">
      <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
        <div class="product-content">
          <div class="product-header">
            <h2>{{ product.Title }}</h2>
            <p class="category">{{ product.category_title }}</p>
          </div>
          <p class="description">{{ product.Description }}</p>
          <p class="condition">
            Condition: {{ product.conditions && product.conditions.length > 0 ? product.conditions.join(', ') : 'N/A' }}
          </p>
          <p class="feature-points">
            Feature Points: {{ product.FeaturePoints }}
          </p>
        </div>
        <router-link :to="`/ProductUpdate/${product.id}`" class="edit-button">Edit</router-link>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div  class="pagination-controls">
      <button @click="previousPage" :disabled="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }} </span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
    </div>

    <br>
    <router-link to="/Upload" class="create-product-button">Create Product</router-link>
  </div>
</template>
<script>
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';

export default {
  data() {
    return {
      userProducts: [],
      currentPage: 1,
      perPage: 2,
      searchTerm: ''
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.userProducts.length / this.perPage);
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.userProducts.slice(start, end);
    },

    currentUser() {
      return this.$store.getters.thisUser;
    }
  },

  watch: {
    currentUser: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.fetchUserProducts();
        }
      }
    }
  },

  methods: {
    async fetchUserProducts() {
      if (!this.currentUser) return;

      const productsCollection = collection(firebase, 'products');
      const q = query(productsCollection, where('uploaderUID', '==', this.currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);
        this.userProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    },

    async searchProducts() {
      this.currentPage = 1; // Reset to the first page when a new search is initiated.

      if (!this.currentUser) return;

      const productsCollection = collection(firebase, 'products');
      const titleQuery = query(productsCollection, where('Title', '>=', this.searchTerm), where('Title', '<=', this.searchTerm + '\uf8ff'), where('uploaderUID', '==', this.currentUser.uid));

      try {
        const querySnapshot = await getDocs(titleQuery);
        this.userProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error searching products:', error);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>


<style scoped>
.manage-products-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f5f5f5;
}

.product-card {
  display: flex;
  flex-direction: column; /* Set it to column so it expands vertically */
  margin: 20px 0; /* Increased margin for more spacing between cards */
  padding: 20px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background-color: white;
  position: relative;
  transition: box-shadow 0.2s ease;
  justify-content: space-between;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.product-content {
  padding-bottom: 30px; /* Add some padding at the bottom to accommodate the Edit button */
  flex-grow:1;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* 1. Added this line to give space between the header and content below */
}

.product-card h2, .category, .description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card h2 {
  max-height: 48px; /* Example height */
}
.category {
  font-size: 14px;
  color: #777;
}

.description {
  max-height: 60px; /* Example height */
  overflow: auto;
  margin-top: 10px; /* Added this line to give a little space above the description */
}
.condition {
  font-size: 14px;
  margin-top: 5px;
  color: #555;
}

.feature-points {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #FFC107; /* Fun yellow color */
  color: #333;
  border-radius: 50px;
  font-weight: bold;
  font-size: 12px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-button {
  align-self: flex-start; /* Align it to the start of the card */
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.edit-button:hover {
  background-color: #0056b3;
}

.create-product-button {
  padding: 10px 20px;
  background: linear-gradient(90deg, #003f8f 0%, #002b70 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  letter-spacing: 0.8px;
  font-size: 16px;
  outline: none;
  text-decoration: none;
}

.create-product-button:hover {
  background: linear-gradient(90deg, #002b70 0%, #001955 100%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.create-product-button:active {
  background: linear-gradient(45deg, #53477A, #8B47A5);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.pagination-controls button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.pagination-controls button:hover {
  background-color: #0056b3;
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

</style>