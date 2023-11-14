<template>
  <div class="product-table-container">
    <h2>Products</h2>
    
    <table v-if="paginatedProducts.length">
      <thead>
        <tr>
          <th @click="sortColumn('ProductImages[0]')">Image</th>
          <th @click="sortColumn('Title')">Title</th>
          <th @click="sortColumn('uploader_username')">Uploader</th>
          <th @click="sortColumn('AvailableQntty')">Available Quantity</th>
          <th @click="sortColumn('FeaturePoints')">Feature Points</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td><img :src="product.ProductImages[0]" alt="Product Image" class="product-thumbnail" /></td>
          <td>{{ product.Title }}</td>
          <td>{{ product.uploader_username }}</td>
          <td>{{ product.AvailableQntty }}</td>
          <td>{{ product.FeaturePoints }}</td>
          <td>
              <button class="seeMore" @click="seeMore(product)">See More</button>
              <button class="increase" @click="increaseFeaturePoints(product)">Increase</button>
              <button class="decrease" @click="decreaseFeaturePoints(product)">Decrease</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else>No products found.</div>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProductTable',
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 2,
      sortKey: '',       // Key for which column to sort
      sortOrders: {      // Initialize with default sort orders
        'ProductImages[0]': 1,
        'Title': 1,
        'uploader_username': 1,
        'AvailableQntty': 1,
        'FeaturePoints': 1
      }
    };
  },
  computed: {
    ...mapState(['products']),
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.products.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    }
  },
  methods: {
    ...mapActions(['fetchProducts']),
    seeMore(product) {
      console.log(`Seeing more details for product: ${product.Title}`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    sortColumn(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1; 
      this.products = this.products.sort((a, b) => {
        return a[key] > b[key] ? this.sortOrders[key] : -1 * this.sortOrders[key];
      });
    },
    increaseFeaturePoints(product) {
        this.$store.dispatch('increaseFeaturePoints', product.id);
        console.log(`Feature Points increased for product: ${product.Title}`);
    },
    decreaseFeaturePoints(product) {
        this.$store.dispatch('decreaseFeaturePoints', product.id);
        console.log(`Feature Points decreased for product: ${product.Title}`);
    }
  },
  created() {
    this.fetchProducts();
  }
}
</script>

<style>
.product-table-container {
    max-width: 800px;  /* Reduced from 1000px */
    width: 85%;  /* Reduced a bit to occupy less space */
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 20px;  /* Reduced padding for a tighter layout */
    overflow: hidden; /* Remove overflow from container */
}

h2 {
    font-size: 1.5rem;  /* Slightly reduce the size */
    color: #344955;
    margin-bottom: 20px;  /* Reduced margin */
    font-weight: 500;
    text-align: center;
}

.product-thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    object-fit: cover;
}

table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    border-radius: 10px;
    transition: transform 0.3s;
}

table:hover {
    transform: scale(1.01);
}

table th, table td {
    padding: 10px;  /* Reduced from 15px */
    border: 1px solid #e0e0e0;
    text-align: center;
    vertical-align: middle;
    font-size: 0.9rem;  /* Reduced font size for better spacing */
    transition: background-color 0.3s;
}

table tr:hover {
    background-color: #f7f7f7;
}

table th {
    background-color: #e0e0e0;
    cursor: pointer;
}

table th:hover {
    background-color: #d1d1d1;
}

button {
    padding: 4px 8px;  /* Reduced padding for compactness */
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 0.85rem;  /* Reduced font size */
}

button.seeMore {
    background-color: #007BFF;
}

button.increase {
    background-color: #28a745;
}

button.decrease {
    background-color: #dc3545;
}

button:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

button:active {
    box-shadow: none;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;  /* Reduced margin */
    padding: 8px;  /* Slightly reduced padding */
    background-color: #e0e0e0;
    border-radius: 10px;
}

.pagination button {
    padding: 4px 12px;  /* Reduced padding */
    cursor: pointer;
    background-color: #3f51b5;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    font-size: 0.85rem;  /* Reduced font size */
}

.pagination button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
}

.pagination span {
    font-size: 0.85rem;  /* Reduced font size */
}
</style>

