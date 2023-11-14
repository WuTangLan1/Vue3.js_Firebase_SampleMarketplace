<template>
    <div class="filters-panel">
        <h2>Options</h2>
  
        <div class="search-and-actions">
            <div class="search-container">
                <input type="text" v-model="searchQuery" placeholder="Search products..." @input="emitSearchQuery" />
            </div>
            <button :disabled="!selectedProduct" @click="deleteProduct" :class="{ active: selectedProduct }">
                Delete
            </button>
            <button :disabled="!selectedProduct" @click="viewProductCard">
                Product Card
            </button>
        </div>
  
        <div class="filters">
            <div class="filter-item">
                <label>Price:</label>
                <select v-model="priceFilter" @change="emitFilters">
                    <option value="">No Limit</option>
                    <option v-for="price in priceOptions" :key="price">{{ price }}</option>
                </select>
            </div>
            <div class="filter-item">
                <label>Category:</label>
                <select v-model="categoryFilter" @change="emitFilters">
                    <option value="">All Categories</option>
                    <option v-for="category in distinctCategories" :key="category">{{ category }}</option>
                </select>
            </div>
            <div class="filter-item">
                <label>Community:</label>
                <select v-model="communityFilter" @change="emitFilters">
                    <option value="">All Communities</option>
                    <option v-for="community in distinctCommunities" :key="community">{{ community }}</option>
                </select>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    props: {
      selectedProduct: {
        type: Object,
        default: null,
      }
    },
    data() {
      return {
        searchQuery: '',
        priceFilter: "",
        categoryFilter: "",
        communityFilter: "",
        priceOptions: ["R0-R500", "R501-R1000", "R1001-R1500", "R1501-R2000", "R2001-R2500", "R2501-R3000", "R3001-R3500", "R3501-R4000"]
      };
    },
    computed: {
      ...mapState(['products']),
      distinctCategories() {
        const categories = new Set();
        this.products.forEach(product => categories.add(product.category_title));
        return [...categories];
      },
      distinctCommunities() {
        const communities = new Set();
        this.products.forEach(product => communities.add(product.community_title));
        return [...communities];
      }
    },
    methods: {
      emitSearchQuery() {
        this.$emit('updateSearchQuery', this.searchQuery);
      },
      emitFilters() {
        this.$emit('updateFilters', {
          price: this.priceFilter,
          category: this.categoryFilter,
          community: this.communityFilter
        });
      },
      deleteProduct() {
        this.$emit('deleteSelectedProduct');
      },
      viewProductCard() {
        this.$emit('viewSelectedProductCard');
      },
    },
  };
  </script>
  
  <style scoped>
  /* You can move relevant styles from the ProductsView.vue here */
  </style>
  