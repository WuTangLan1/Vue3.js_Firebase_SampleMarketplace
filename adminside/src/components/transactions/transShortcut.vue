<template>
  <div class="transaction-container">
    <!-- Use global .component-heading class for h1 -->
    <h1 class="component-heading">Transactions</h1>
    
    <table class="transaction-table">
      <thead>
        <tr>
          <th>Date of Agreement</th>
          <th>Buyer</th>
          <th>Seller</th>
          <th>Product</th>
          <th>Service Fee</th>
          <th>Total Amount</th>
          <th>Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.transactionId">
          <td>{{ formatDate(transaction.dateOfAgreement) }}</td>
          <td>{{ getUsernameById(transaction.buyerId) }}</td>
          <td>{{ getUsernameById(transaction.sellerId) }}</td>
          <td>{{ getProductTitleById(transaction.productId) }}</td>
          <td>R{{ transaction.serviceFee }}</td>
          <td>R{{ transaction.totalAmount }}</td>
          <td>{{ formatDate(transaction.transactionDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { mapState } from 'vuex';
import { getDocs, collection } from 'firebase/firestore'; 
import { firestore } from '@/firebase/index.js'; 

export default {
  data() {
    return {
      users: [], // Store all users to fetch the usernames by UID
      products: [] // Store all products to fetch the titles by productID
    };
  },
  computed: {
    ...mapState(['transactions'])
  },
  methods: {
    formatDate(timestamp) {
      const date = timestamp.toDate(); 
      return date.toLocaleDateString(); 
    },
    async fetchAllUsers() {
      const usersRef = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersRef);
      this.users = usersSnapshot.docs.map(doc => doc.data());
    },
    getUsernameById(uid) {
      const user = this.users.find(u => u.uid === uid);
      return user ? user.username : 'Unknown';
    },
    async fetchAllProducts() {
      const productsRef = collection(firestore, 'products'); // Assuming your collection name is 'products'
      const productsSnapshot = await getDocs(productsRef);
      this.products = productsSnapshot.docs.map(doc => doc.data());
    },
    getProductTitleById(productId) {
      const product = this.products.find(p => p.productID === productId);
      return product ? product.Title : 'Unknown Product';
    }
  },
  async mounted() {
    await this.fetchAllUsers();
    await this.fetchAllProducts(); // Fetch products when the component is mounted
    if (!this.$store.state.transactions || !this.$store.state.transactions.length) {
      this.$store.dispatch('fetchTransactions');
    }
  }
};
</script>


<style scoped>
.transaction-container {
  width: 100%;
  padding: 2rem;
  background: #FAFAFA;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
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
  text-align: center; /* Center the heading */
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto; /* Center the table horizontally */
}

.transaction-table thead th {
  background-color: #3f51b5;
  color: #FFF;
  padding: 10px;
  text-align: left;
}

.transaction-table tbody td {
  padding: 10px;
  border: 1px solid #ddd;
}

.transaction-table tbody tr:hover {
  background-color: #f5f5f5; /* Light gray color on hover */
  cursor: pointer; /* Change cursor to indicate interactivity */
}
</style>
