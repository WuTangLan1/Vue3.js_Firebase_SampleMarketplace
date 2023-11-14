<template>
  <div class="offers-container">
    <div class="filter-switch">
      <button 
        @click="switchFilter" 
        class="switch-button" 
        :class="{ 'active-filter': filterType === 'incoming' }"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Loading...' : `Switch to ${filterType === 'incoming' ? 'Outgoing' : 'Incoming'} Offers` }}
      </button>
    </div>
    <div class="offers-list">
      <!-- Wrapping the offer cards in a transition tag -->
      <transition name="card-transition" mode="out-in">
        <div :key="transitionKey">
        <div>
          <div v-if="isLoading" class="loading-state">Loading offers...</div>
          <div v-else-if="isError" class="error-state">There was an error loading the offers.</div>
          <div v-else-if="filteredOffers.length === 0" class="empty-state">No offers found.</div>
          <div v-else>
            <div v-for="(offer, index) in filteredOffers" :key="offer.offerId" class="offer-card">
              <div class="transaction-section">
                <h3>Transaction Info</h3>
                <p><strong>Buyer:</strong> {{ offer.buyerUsername }}</p>
                <p><strong>Seller:</strong> {{ offer.sellerUsername }}</p>
                <p><strong>Buyer Resolved:</strong> <span :class="offer.buyerResolved ? 'true-bg' : 'false-bg'">{{ offer.buyerResolved }}</span></p>
                <p><strong>Seller Resolved:</strong> <span :class="offer.sellerResolved ? 'true-bg' : 'false-bg'">{{ offer.sellerResolved }}</span></p>
                <p><strong>Final Resolve:</strong> <span :class="offer.finalResolve ? 'true-bg' : 'false-bg'">{{ offer.finalResolve }}</span></p>
                <p><strong>Offer Price:</strong> {{ offer.offerPrice }}</p>
              </div>

              <div class="product-section">
                <h3 class="product-title" v-html="processedProductTitles[index]"></h3>
                <div class="product-box">
                  <img v-if="offer.productImage" :src="offer.productImage" alt="Product Image">
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </transition>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="!canGoToPrevPage() || isLoading">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="!canGoToNextPage() || isLoading">Next</button>
    </div>
  </div>
</template>



<script>
import { firestore } from '@/firebase/index.js';  
import { collection, where, getDocs, query, doc, getDoc } from 'firebase/firestore';

export default {
  props: ['uid'],
  data() {
    return {
      offers: [],
      filterType: 'incoming',
      currentPage: 1,  // Current Page Number
      offersPerPage: 1, // Number of offers to display per page
      transitionKey: 0,
      isLoading: true, // To handle loading state
      isError: false, // To handle errors
    };
  },
  computed: {
    processedProductTitles() {
        return this.filteredOffers.map(offer => {
            let title = offer.productTitle;
            let chars = 0;
            let words = title.split(' ');
            let newTitle = '';

            for (let i = 0; i < words.length; i++) {
                if (chars + words[i].length > 10) {
                    newTitle += '<br>';
                    chars = 0;
                }
                newTitle += words[i] + ' ';
                chars += words[i].length;
            }

            return newTitle.trim();
        });
    },
    filteredOffers() {
      let offers = this.filterType === 'incoming' ? 
        this.offers.filter(offer => offer.sellerId === this.uid) :
        this.offers.filter(offer => offer.buyerId === this.uid);
    
      // Pagination Logic
      const start = (this.currentPage - 1) * this.offersPerPage;
      const end = start + this.offersPerPage;

      return offers.slice(start, end);
    },
    totalPages() {
      let totalOffers = this.filterType === 'incoming' ? 
        this.offers.filter(offer => offer.sellerId === this.uid).length :
        this.offers.filter(offer => offer.buyerId === this.uid).length;

      return Math.ceil(totalOffers / this.offersPerPage);
    }
  },
  methods: {
    async fetchProduct(productId) {
      const productRef = doc(firestore, 'products', productId);
      const productSnapshot = await getDoc(productRef);
      
      if (productSnapshot.exists()) {
        return productSnapshot.data();
      } else {
        return null;
      }
    },
    async fetchOffers() {
      try {
        const offersRef = collection(firestore, 'offers');
  
      const incomingOffersQuery = query(offersRef, where('sellerId', '==', this.uid));
      const incomingOffersSnapshot = await getDocs(incomingOffersQuery);

      const outgoingOffersQuery = query(offersRef, where('buyerId', '==', this.uid));
      const outgoingOffersSnapshot = await getDocs(outgoingOffersQuery);

      const allOffers = [...incomingOffersSnapshot.docs, ...outgoingOffersSnapshot.docs].map(doc => doc.data());
      
      for (let offer of allOffers) {
        const product = await this.fetchProduct(offer.productId);
        if (product) {
          offer.productTitle = product.Title;
          if (Array.isArray(product.ProductImages) && product.ProductImages.length > 0) {
              offer.productImage = product.ProductImages[0];
              offer.productPrice = product.Price
          }
      }

      }
  
      this.offers = allOffers;
      } catch(error) {
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    },
    switchFilter() {
        this.filterType = this.filterType === 'incoming' ? 'outgoing' : 'incoming';
        this.currentPage = 1; // Reset the page to 1 when switching filters
        this.transitionKey++;
    },
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.transitionKey++;
        }
    },
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.transitionKey++;
        }
    },
    canGoToPrevPage() {
      return this.currentPage > 1;
    },
    canGoToNextPage() {
      return this.currentPage < this.totalPages;
    }
  },
  created() {
    this.fetchOffers();
  }
}
</script>

<style scoped>

.offers-container {
  font-family: 'Arial', sans-serif;
  max-width: 1000px;
  min-width: 500px;
  margin: 20px auto;
  padding: 10px;
  border-radius: 8px;
  background: #f5f5f5;
}

.filter-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.switch-button {
  padding: 10px 20px;
  background: #007BFF;
  border: none;
  border-radius: 4px;
  color: #FFF;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch-button:hover {
  background: #0056b3;
}

.switch-button:hover, .pagination button:hover {
  transform: scale(1.05);  /* Slight scaling effect */
}

.offers-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.offer-card {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 10px 0;
  padding: 15px;
  background-color: #FFF3E0;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.3s;
  flex-direction: row-reverse;
}

.offer-card:hover {
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
}

.product-section {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  align-items: center; /* Center items horizontally */
  flex: 1;
  padding: 10px;
}

.product-box {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center title and image horizontally */
  justify-content: center; /* Center title and image vertically */
}

.product-title {
    text-align: center;
    margin-bottom: 10px;
    white-space: normal;
}


.product-info h3, .transaction-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}
.transaction-section {
  flex: 1.5;
  padding: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #0056b3;
}

.pagination button:disabled {
  background-color: #b3c7d1;
  cursor: not-allowed;
}

.card-transition-enter-active, .card-transition-leave-active {
  transition: opacity 0.5s;
}
.card-transition-enter, .card-transition-leave-to /* .card-transition-leave-active in <2.1.8 */ {
  opacity: 0;
}
.active-filter {
  background: #009BFF;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.true-bg {
    background-color: #e6ffe6; /* Light green */
    padding: 2px 5px;
    border-radius: 4px;
}

.false-bg {
    background-color: #ffe6e6; /* Light red */
    padding: 2px 5px;
    border-radius: 4px;
}
</style>
