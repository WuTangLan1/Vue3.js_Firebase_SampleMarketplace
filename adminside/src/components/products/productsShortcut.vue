<template>
  <div class="product-container">
    <h1 class="component-heading">Most Featured Products</h1>
    
    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="Search products..." />
      <router-link to="/ProductsView" class="dashboard-link">Full Product Dashboard</router-link>
    </div>

    <div class="product-bubbles">
      <ProductBubble 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
        :background="getCategoryColor(product.category_title)"
        @seeMore="handleSeeMoreClick(product.id)"
      />
    </div>
    
    <div class="color-key">
      <div 
        v-for="category in distinctCategories" 
        :key="category" 
        class="key-item"
        @click="selectCategory(category)"
        :class="{ 'selected': category === selectedCategory }"
      >
        <div :style="{ backgroundColor: getCategoryColor(category) }" class="color-box"></div>
        <span>{{ category }}</span>
      </div>
    </div>

    <button v-if="selectedCategory" @click="resetFilter">Show all products</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductBubble from '@/components/products/ProductBubble.vue';

export default {
  components: {
    ProductBubble
  },
  data() {
    return {
      selectedCategory: null,
      categoryColors: {},
      isAvailable: true,
      searchQuery: '',
    };
  },
  computed: {
    ...mapState(['products']),
    distinctCategories() {
      const categories = new Set();
      this.products.forEach(product => categories.add(product.category_title));
      return [...categories];
    },
    filteredProducts() {
      let products = [...this.products];  
      
      if (this.searchQuery) {
        const searchQuery = this.searchQuery.toLowerCase();
        products = products.filter(product => product.Title.toLowerCase().includes(searchQuery));
      }

      products = products.filter(product => product.isAvailable === this.isAvailable);
      
      if (this.selectedCategory) {
        products = products.filter(product => product.category_title === this.selectedCategory);
      }

      return products;
    },
  },
  methods: {
    getCategoryColor(category) {
      const colors = ['#E57373', '#81C784', '#64B5F6', '#FFD54F', '#7986CB', '#4DD0E1', '#A1887F', '#FF8A65'];

      if (!this.categoryColors[category]) {
        for (const color of colors) {
          if (!Object.values(this.categoryColors).includes(color)) {
            this.categoryColors[category] = color;
            break;
          }
        }
      }
      return this.categoryColors[category];
    },
    handleSeeMoreClick(productId) {
      this.$router.push({
        name: 'ProductInfoView',
        params: {
          prodId: productId
        }
      });
    },

    selectCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = null;  
      } else {
        this.selectedCategory = category;
      }
    },
    resetFilter() {
      this.selectedCategory = null;
    }
  },
  mounted() {
    this.$store.dispatch('fetchProducts');
  }
};
</script>

<style>
.product-container {
    width: 100%;
    padding: 2rem;
    background: #FAFAFA;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center; 
    animation: fadeIn 0.3s ease-in-out;
    justify-content: center;
    position: relative;
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

.component-heading {
  margin: 0;
  font-size: 1.5em;
  color: #ffffff !important;  
  font-weight: 600;
  background-color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}


.top-ranked {
  box-shadow: 0px 0px 15px 5px rgba(255, 223, 0, 0.7);
}

.product-container h1 {
  margin: 0;
  font-size: 1.5em;
  color: #ffffff; /* already set to white */
  font-weight: 600;
  background-color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.product-bubbles {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
  justify-content: center;
  width: 90%; 
  margin: 1rem auto;
  max-height: 500px; 
  overflow-y: auto;
  min-width: 810px;
}

.product-bubbles > * {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-bubbles > *:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
}

.product-bubbles > *.top-ranked:hover {
  box-shadow: 0px 0px 20px 8px rgba(255, 223, 0, 0.7);
}

.product-bubbles > *:active {
  transform: scale(0.98);
}

.color-key {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin: 20px auto;
}

.key-item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.key-item.selected {
  background-color: #e0e0e0;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

button {
  margin-top: 20px;
  background-color: #3f51b5;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #344694;
}

.dashboard-link {
  position: absolute;
  top: 10px; 
  right: 20px; 
  color: #3f51b5; 
  text-decoration: none; 
  font-weight: 600; 
  transition: color 0.3s; 
}

.dashboard-link:hover {
  color: #0056b3; 
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  vertical-align: middle;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px; 
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3f51b5;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

table {
  table-layout: fixed;
  width: 100%;
}

@media (max-width: 768px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tbody tr {
    margin-bottom: 1rem;
  }
  td {
    border: none;
    position: relative;
    padding-left: 50%; 
  }
  td:before {
    content: attr(data-label);
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }
}
@media (max-width: 768px) {
  .product-container {
    overflow-x: auto;
  }
}
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; 
  margin: 1rem 0;
}

.filters input[type="text"] {
  padding: 10px; 
  border: 2px solid #007BFF;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s;
}

.filters input[type="text"]:focus {
  border: 2px solid #0056b3;
  outline: none; 
}

</style>
