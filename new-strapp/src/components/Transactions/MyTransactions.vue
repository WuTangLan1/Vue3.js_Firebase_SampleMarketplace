<template>
  <div class="my-transactions-container">
    <h1>My Transactions</h1>
    
    <!-- Filter Switch -->
    <div class="filter-switch">
      <button :class="{ active: currentFilter === 'buyer' }" @click="currentFilter = 'buyer'">Buyer Transactions</button>
      <button :class="{ active: currentFilter === 'seller' }" @click="currentFilter = 'seller'">Seller Transactions</button>
    </div>
    
    <div v-if="displayedTransactions.length > 0" class="transaction-cards">
      <div v-for="(transaction, index) in displayedTransactions" :key="transaction.transactionId" class="transaction-card">
        
        <!-- Positioning container for transaction number and delete button -->
        <div class="card-top">
          <div class="transaction-number">{{ index + 1 }}</div>
          <button @click="deleteTransaction(transaction.transactionId)" class="delete-button">×</button>
        </div>

        <h2 @click="toggleTransactionDetails(transaction)">
          Product: <u>{{ transaction.productTitle }}</u>
        </h2>

        <div v-if="transaction.showDetails" class="transaction-details">
          <p><b>Offer Price: </b>R{{ transaction.offerPrice }}</p>
          <p><b>Service Fee: </b>{{ transaction.serviceFee }}</p>
          <p><b>Total Amount: </b>{{ transaction.totalAmount }}</p>
          <p><b>Date of Agreement: </b>{{ formatDate(transaction.dateOfAgreement) }}</p>
          <p><b>Transaction Date: </b>{{ formatDate(transaction.transactionDate) }}</p>
          <p><b>Buyer: </b>{{ transaction.buyerUsername }}</p>
          <p><b>Seller: </b>{{ transaction.sellerUsername }}</p>
          <button @click="toggleTransactionDetails(transaction)" class="see-more-button close-button">
            Close transaction details
          </button>
        </div>
        
        <!-- Show "Open transaction" button when details are closed -->
        <button @click="toggleTransactionDetails(transaction)" class="see-more-button open-button" v-else>
          View transaction details
        </button>
      </div>
    </div>
    <div v-else>
      <p class="no-transactions">You do not have any transactions yet</p>
    </div>
  </div>
</template>



<script>
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';

export default {
  data() {
    return {
      userTransactions: [],
      currentFilter: 'buyer' 
    };
  },

  created() {
    this.fetchUserTransactions();
  },

  computed: {
      buyerTransactions() {
        const currentUser = this.$store.getters.thisUser;
        return this.userTransactions.filter(t => t.buyerId === currentUser.uid);
      },

      sellerTransactions() {
        const currentUser = this.$store.getters.thisUser;
        return this.userTransactions.filter(t => t.sellerId === currentUser.uid);
      },

      displayedTransactions() {
        return this.currentFilter === 'buyer' ? this.buyerTransactions : this.sellerTransactions;
      }
    },


  methods: {
    formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JavaScript Date object
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add padding to display as 2 digits
    const day = date.getDate().toString().padStart(2, '0'); // Add padding to display as 2 digits
    return `${year}/${month}/${day}`;
  },
    async fetchUserTransactions() {
      const currentUser = this.$store.getters.thisUser;

      if (!currentUser) return;

      const transactionsCollection = collection(firebase, 'transactions');

      // Query for transactions where the user is the buyer
      const buyerQuery = query(transactionsCollection, where('buyerId', '==', currentUser.uid));

      // Query for transactions where the user is the seller
      const sellerQuery = query(transactionsCollection, where('sellerId', '==', currentUser.uid));

      const fetchProductTitle = async (productId) => {
        const productDoc = await getDoc(doc(collection(firebase, 'products'), productId));
        return productDoc.data().Title;
      };

      const fetchUsername = async (uid) => {
        const userDoc = await getDoc(doc(collection(firebase, 'users'), uid));
        return userDoc.data().username;
      };

      const processSnapshot = async (snapshot) => {
        for (let transactionDoc of snapshot.docs) {
          const transactionData = {
            transactionId: transactionDoc.id,
            ...transactionDoc.data(),
            showDetails: false, // Initialize showDetails as false
            productTitle: await fetchProductTitle(transactionDoc.data().productId),
            buyerUsername: await fetchUsername(transactionDoc.data().buyerId),
            sellerUsername: await fetchUsername(transactionDoc.data().sellerId)
          };
          this.userTransactions.push(transactionData);
        }
      };

      try {
        // Fetch transactions for both queries
        const [buyerSnapshot, sellerSnapshot] = await Promise.all([
          getDocs(buyerQuery),
          getDocs(sellerQuery)
        ]);

        await Promise.all([processSnapshot(buyerSnapshot), processSnapshot(sellerSnapshot)]);
      } catch (error) {
        console.error('Error fetching user transactions:', error);
      }
    },

    async deleteTransaction(transactionId) {
      const transactionsCollection = collection(firebase, 'transactions');

      try {
        // Delete the transaction document from Firestore
        await deleteDoc(doc(transactionsCollection, transactionId));
        
        this.userTransactions = this.userTransactions.filter((transaction) => transaction.transactionId !== transactionId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    },

    toggleTransactionDetails(transaction) {

      transaction.showDetails = !transaction.showDetails;
    },
  },
};
</script>



<style scoped>
.my-transactions-container {
  max-width: 800px;
  margin: 2em auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #f8f9fa;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 1em;
  color: #333;
  font-weight: 500;
}

.transaction-card {
  width: 100%;
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.transaction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-number {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  background-color: #e2e2e2;
  color: #333;
  padding: 0.2em 0.5em;
  border-radius: 3px;
  margin-right: auto; /* Pushes the number to the leftmost side */
}

.delete-button {
  background-color: transparent;
  color: #ea6153;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-left: auto; /* Pushes the delete button to the rightmost side */
}

.filter-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 1em;
}

.filter-switch button {
  padding: 0.5em 1em;
  margin: 0 0.5em;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.filter-switch button:hover {
  background-color: #bbb;
}

.filter-switch button.active {
  background-color: #51b7e6;
  color: white;
}

.delete-button:hover {
  transform: scale(1.1);
  color: #d43f00;
}

.transaction-card h2 {
  font-size: 18px;
  color: #333;
  margin: 0.5em 0;
  cursor: pointer;
}

.transaction-card p {
  font-size: 14px;
  margin: 0.5em 0;
  color: #555;
}

.see-more-button {
  font-size: 14px;
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.open-button {
  background-color: #51b7e6;
  color: white;
}

.open-button:hover {
  background-color: #206491;
}

.close-button {
  background-color: #3684b8;
  color: white;
}

.close-button:hover {
  background-color: #2f8bc9;
}

.no-transactions {
  font-size: 16px;
  color: #777;
}

</style>