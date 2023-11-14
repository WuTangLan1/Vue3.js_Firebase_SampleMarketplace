<template>
  <div class="offers-container">
    
    <!-- Header section -->
    <div class="header-section">
  <h1>Your Offers</h1>
  
  <!-- Segmented Controls for Offer Types -->
  <div class="segmented-controls">
    <button 
      :class="{ 'active': filterState === 'incoming' }" 
      @click="setFilterState('incoming')">
        Incoming
    </button>
    <button 
      :class="{ 'active': filterState === 'outgoing' }" 
      @click="setFilterState('outgoing')">
        Outgoing
    </button>
  </div>
</div>

<!-- Empty State Placeholder -->
<div v-if="offers.length === 0" class="empty-state">
  <span>No offers available at the moment.</span>
</div>
    <div 
      v-for="offer in pagedOffers" 
      :key="offer.offerId" 
      class="offer-card"
      :class="filterState === 'incoming' ? 'incoming-card' : 'outgoing-card'">
      
      <div class="card-header">
        <span class="close-icon" @click="removeOffer(offer.offerId)">×</span>
      </div>

      <div class="card-content">
        <div v-if="offer.productImage" class="product-image">
          <img :src="offer.productImage" alt="Product Image">
        </div>
      
        <div class="message-content">
            <template v-if="filterState === 'incoming'">
                <span class="highlight">{{offer.buyerUsername}}</span> has offered 
                <span class="highlight">R{{ offer.offerPrice }}</span> for your product 
                titled <span class="highlight">{{ offer.productTitle }}</span>.
            </template>
            
            <template v-else>
                You offered <span class="highlight">R{{ offer.offerPrice }}</span> to 
                <span class="highlight">{{offer.sellerUsername}}</span> for their product 
                titled <span class="highlight">{{ offer.productTitle }}</span>.
            </template>
          </div>

        <div class="card-footer">
          <button class="see-more-btn" @click="pushToOfferView(offer.offerId)">See More</button>
        </div>
      </div>
    </div>
<!-- Pagination controls -->
<div class="pagination">
  <button @click="prevPage" :disabled="isPrevDisabled">Previous</button>
  <span>Page {{ page }}</span>
  <button @click="nextPage" :disabled="isNextDisabled">Next</button>
</div>
  <button @click="goHome()">Back</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';
import { useRouter } from 'vue-router';

export default {
  name: 'MyOffers',
  
  setup() {
    const store = useStore();
    const offers = ref([]);
    const router = useRouter();
    const filterState = ref('incoming');  // Default to 'incoming'

    const toggleFilter = () => {
        filterState.value = filterState.value === 'incoming' ? 'outgoing' : 'incoming';
        offers.value = []; // Clear the existing offers
        fetchUserOffers(); // Fetch offers based on the new filter state
    }

    const page = ref(1); // Starting page number
    const perPage = 2;  // Number of offers per page

    const start = computed(() => (page.value - 1) * perPage);
    const end = computed(() => page.value * perPage);

    const pagedOffers = computed(() => {
      return offers.value.slice(start.value, end.value);
    });

    const nextPage = () => {
      if (page.value * perPage < offers.value.length) {
        page.value += 1;
      }
    };

    const prevPage = () => {
      if (page.value > 1) {
        page.value -= 1;
      }
    };

    const isPrevDisabled = computed(() => {
    return page.value === 1 || offers.value.length === 0;
});

const isNextDisabled = computed(() => {
    return page.value * perPage >= offers.value.length || offers.value.length < perPage;
});

const setFilterState = (state) => {
  filterState.value = state;
  offers.value = []; // Clear the existing offers
  fetchUserOffers(); // Fetch offers based on the new filter state
};


    const removeOffer = async (offerId) => {
      // Remove the offer from the Firebase collection
      const offersCollection = collection(firebase, 'offers');
      await deleteDoc(doc(offersCollection, offerId));

      // Remove the offer from the local state
      offers.value = offers.value.filter(offer => offer.offerId !== offerId);
    }

    const logProductId = (productId) => {
      router.push({name : 'ProductFeatureDetails', params:{id:productId}})
    }

    const fetchUserOffers = async () => {
      const currentUser = store.getters.thisUser;

      if (!currentUser) return;

      const offersCollection = collection(firebase, 'offers');
      let q;

      if (filterState.value === 'incoming') {
        q = query(offersCollection, where('sellerId', '==', currentUser.uid));
      } else {
        q = query(offersCollection, where('buyerId', '==', currentUser.uid));
      }
      
      const productsCollection = collection(firebase, 'products');

      try {
        const querySnapshot = await getDocs(q);
        
        for (let offerDoc of querySnapshot.docs) {
          let offerData = offerDoc.data();
          const productDocRef = doc(productsCollection, offerData.productId);
          const productSnapshot = await getDoc(productDocRef);
          const productData = productSnapshot.data();

          offers.value.push({
            offerId: offerDoc.id,
            ...offerData,
            productTitle: productData?.Title,
            productImage: productData?.ProductImages[0],
          });
        }
      } catch (error) {
        console.error('Error fetching user offers:', error);
      }
    }

    onMounted(fetchUserOffers);
  
    return {
      offers,
      removeOffer,
      logProductId,
      toggleFilter,
      filterState,
      nextPage,
      prevPage,
      pagedOffers,
      page,
      perPage,
      isPrevDisabled,
      isNextDisabled,
      setFilterState
    }
  },
  methods: {
    pushToOfferView(offerId){
      this.$router.push({name : 'SingleOfferView', params:{id:offerId}})
    },
    goHome() {
      this.$router.push({name: 'Home'})
    }
  }
}
</script>


<style scoped>
.offers-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Softened shadow for modern look */
  border-radius: 12px;
  background-color: #F8F8F8;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px; /* Separates the header from the rest of the content */
}


.offers-container h1 {
  margin: 0;
  text-align: left;  /* Aligned to left */
  font-size: 2em;
  font-weight: 600;
  color: #333;
}

button {
  margin: 0 20px;
  padding: 10px 20px;
  background: #007BFF; /* Flatter design */
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background 0.3s ease-in-out;
}

button:hover {
  background: #0056b3; /* Flatter design */
  transform: translateY(-2px);
}

.offer-card {
  position: relative;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  background: #FFF;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #E0E0E0;
}

.offer-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Softened shadow for modern look */
  transform: translateY(-3px);
}

.card-header {
  position: absolute;
  top: 15px;
  right: 15px;
}

.close-icon {
  cursor: pointer;
  font-size: 1.5em;
  color: #FF4D4D;
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.product-image {
  flex: 0 0 20%;
  margin-right: 15px;
}

.product-image img {
  width: 100%;
  max-height: 140px;
  object-fit: cover;
  border-radius: 6px;
}

.message-content {
  flex: 1;
  font-size: 1rem;
  position: relative;
}

.highlight {
  font-weight: bold;
  color: #007BFF;
}

.card-footer {
  flex: 0 0 20%;
  display: flex;
  justify-content: center;
  margin-left: 15px;
}

.see-more-btn {
  padding: 8px 25px;
  background: #007BFF; /* Flatter design */
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background 0.3s ease-in-out;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.see-more-btn:hover {
  background: #0056b3; /* Flatter design */
  transform: translateY(-2px);
}

.see-more-btn:active {
  background: #004b99;
  transform: translateY(0);
}

.incoming-card {
  background-color: #EDE7F6;
  border: 1px solid #D5C8F4;
}

.outgoing-card {
  background-color: #E3F2FD;
  border: 1px solid #B8DFFA;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding: 0 20px 20px 20px; /* Added bottom padding for space */
  border-top: 1px solid #E0E0E0;
}

.pagination button {
  padding: 10px 20px;
  background: #007BFF; /* Flatter design */
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.pagination button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pagination button:hover {
  background-color: #0056b3;
}

.segmented-controls {
  margin-left: 20px;  
  display: flex;
  border: 1px solid #007BFF;
  border-radius: 30px;
  overflow: hidden;
}

.segmented-controls button {
  flex: 1;
  background: transparent;
  color: #007BFF;
  padding: 8px 12px;
}

.segmented-controls button.active {
  background: #007BFF;
  color: #FFF;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #666;
  font-size: 1.2em;
}

</style>
