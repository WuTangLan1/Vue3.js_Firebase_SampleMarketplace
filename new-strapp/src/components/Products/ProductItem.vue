<template>
  <!-- Main Product Container -->
  <div class="product-container">
    <!-- Loading Section -->
    <div v-if="loading" class="loading-product">
      Loading product...
      <loader/>
    </div>
    <!-- Main Content -->
    <div v-else class="product-card">
      <!-- Images Section -->
      <div class="frame">
        <div class="images-section">
          <div class="image-wrapper">
            <img v-for="(img, index) in product.ProductImages" :src="img" :alt="'Product Image ' + (index + 1)" :key="index" />
          </div>
          <p class="last-edit-date"><strong>Last Edited:</strong> {{ formatDate(product.LastEditDate) }}</p>
        </div>
      </div>
      <!-- Product Details Section -->
      <div class="frame product-details">
  <div class="product-title">
    <h2>{{ product.Title }}</h2>
  </div>
  <div class="info-section">
    <div class="info-item">
      <strong class="info-label">Available Quantity:</strong><br>
      <span class="info-value">{{ product.AvailableQntty }}</span>
    </div>
    <div class="info-item">
      <strong class="info-label">Price:</strong><br>
      <span class="info-value">R{{ product.Price }}</span>
    </div>
    <div class="info-item">
      <strong class="info-label">Last Edit Date:</strong><br>
      <span class="info-value">{{ formatDate(product.LastEditDate) }}</span>
    </div>
    <div class="info-item">
      <strong class="info-label">Category Title:</strong><br/>
      <span class="info-value">{{ product.category_title }}</span>
    </div>
    <div class="info-item">
      <strong class="info-label">Community Title:</strong><br/>
      <span class="info-value">{{ product.community_title }}</span>
    </div>
  </div>
</div>
      <!-- Condition section -->
      <div class="frame">
        <div class="condition-section">
          <h3>Condition</h3>
          <ul class="conditions">
            <li v-for="condition in product.conditions" :key="condition">{{ condition }}</li>
          </ul>
        </div>
      </div>
      <!-- Availability -->
      <div class="frame">
        <div class="availability">
          <p class="availability-text">{{ product.isAvailable ? 'Available' : 'Not Available' }}</p>
        </div>
      </div>
      <!-- Uploader Details -->
      <div class="frame">
        <div class="uploader-details">
          <p><strong>Uploader:</strong> <br> {{ product.uploader_username }}</p>
        </div>
      </div>
      <!-- Buy Button -->
      <div v-if="$store.state.user && product.isAvailable" class="frame">
          <!--<button class="buy" @click="navigateRouterPush()">BUY</button>-->
            <div class="offer-text">How much would you like to offer?</div>
            <input type="number" v-model.number="offerPrice" @input="updateOfferInfo()"/>
            <div class="offer-text">{{offerInfo}}</div>
            <button class="buy-offer" @click="makeOffer()"><div v-if="!offerLoading">Make Offer</div><div v-else><loader/></div></button>
      </div>
      <router-link :to="{ name: 'ProductList' }" class="link">
  <button class="gradient-button">
    {{ loading ? 'Back...' : 'Back' }}
  </button>
</router-link>
    </div>
  </div>
</template>

<script>
import { setDoc, getDocs, query, where, collection, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';
import {uuid} from 'vue-uuid'
import loader from '../LoaderIcon.vue'

export default {
  props: ['id'],
  data() {
    return {
      loading: true,
      product: {
        AvailableQntty: 1,
        Description: 'TEST TEST TEST ...',
      },
      offerInfo: "You are offering the asking price",
      offerPrice: 0,
      offerLoading: false
    };
  },
  components: {
    loader
  },
  async mounted() {
    console.log("Received ID:", this.id);
    await this.fetchProduct(this.id);
    //call method to update featurePoints
    console.log(this.$store.state.user)
    await this.featurePoints()
    this.offerPrice = this.product.Price
  },
  methods: {
    async featurePoints(){
      //check that the user is logged in
      if (!this.$store.state.user) {
        console.log(this.$store.thisUser)
        console.log("NO USER!!!")
        return
      }
      //user is logged in, update FP
      try {
        let oldFP = this.product.FeaturePoints
        let newFP = oldFP + 1
        const productDocRef = doc(firebase, 'products', this.product.productID);
        await updateDoc(productDocRef, {FeaturePoints:newFP});
      }catch (error){
        console.error('Error updating product:', error);
      }
    },
    navigateRouterPush() {
  const productData = JSON.stringify(this.product);
  this.$router.push({ name: 'TransactionPage', query: { productData } });
},
async makeOffer(){
  this.offerLoading = true
  const date = new Date()
  const timestamp = Timestamp.fromDate(date)
  const newOffer = {
    buyerId:this.$store.state.user.uid,
    buyerResolved: true,
    buyerUsername: this.$store.state.user.username ,
    finalResolve: false,
    offerPrice: this.offerPrice,
    offerId: uuid.v1(),
    productId: this.product.productID,
    sellerId: this.product.uploaderUID,
    sellerResolved: false,
    sellerTurn: true,
    sellerUsername: this.product.uploader_username,
    timestamp: timestamp
  }
  //push to firebase
  const offerId = newOffer.offerId
  const offerCollection = collection(firebase, 'offers')
  const offerRef = doc(offerCollection,offerId)
  await setDoc(offerRef, newOffer)
  //oooooh loading toggle
  this.offerLoading = false
  //router yeet
  this.$router.push({ name: 'NotificationsView' })
},
updateOfferInfo(){
  let offer = this.offerPrice
  let prod = this.product.Price
  let output = ""
  if(prod == offer){
    output = "You are offering the asking price"
  } else if (offer < prod){
    let percDiff = ((prod - offer)/prod)*100
    output = "You are offering %"+percDiff.toFixed(2)+" less than the asking price"
  } else {
    let percDiff = ((offer-prod)/prod)*100
    output = "You are offering %"+percDiff.toFixed(2)+" more than the asking price"
  }
  this.offerInfo = output
},



    formatDate(dateString) {
      const now = new Date();
      const then = new Date(dateString);
      const differenceInMs = now - then;
      // Calculate differences in various units
      const differenceInSeconds = Math.floor(differenceInMs / 1000);
      const differenceInMinutes = Math.floor(differenceInSeconds / 60);
      const differenceInHours = Math.floor(differenceInMinutes / 60);
      const differenceInDays = Math.floor(differenceInHours / 24);
      // Return appropriate string based on the difference
      if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minute(s) ago`;
      } else if (differenceInHours < 24) {
        return `${differenceInHours} hour(s) ago`;
      } else {
        return `${differenceInDays} day(s) ago`;
      }
    },
    async fetchProduct(prodID) {
      console.log("Product Loading...");
      this.loading = true;
      const q = query(
        collection(firebase, 'products'),
        where('productID', '==', prodID)
      );
      const snap = await getDocs(q);
      if (snap.size > 0) {
        this.product = snap.docs.map((doc) => doc.data())[0];
        console.log("Product Loaded!", this.product);
        this.loading = false;
      } else {
        console.log("error");
      }
    },

  },
};
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
/* Container styling */
.product-container {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  
  animation: fadeIn ease 0.9s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.offer-container {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  
  animation: fadeIn ease 0.9s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}


/* Loading section */
.loading-product {
  font-size: 24px;
  margin: 20px;
  animation: fadeIn ease 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* Main card layout */
.product-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  max-width: 400px;
  animation: fadeIn ease 0.7s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

/* Frame styling */
.frame {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}


/* Images section */
.images-section {
  text-align: center;
  align-items: center;
}

.image-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-wrapper img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.last-edit-date {
  margin-top: 5px;
  font-weight: bold;
}

/* Product details section */
.product-details {
  text-align: center;
}

.product-details h2 {
  font-size: 28px;
  margin: 0;
}

.product-info {
  margin-top: 10px;
  font-size: 16px;
}

.product-info p {
  margin: 10px 0;
}

/* Condition section */
.condition-section {
  text-align: center;
 
}

.conditions {
  list-style: none;
  padding: 0;
}

.conditions li {
  margin: 5px 0;
  font-size: 16px;
}

/* Availability section */
.availability {
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
  font-size: 20px;
}

/* Uploader details section */
.uploader-details {
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
}

/* Buy button section */
.buy-button {
  text-align: center;
  margin-top: 10px;
}

.buy {
  padding: 10px 20px;
  background: linear-gradient(135deg, #c965c9, #6c6ced); 
  border: none;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 18px;
}
.gradient-button {
  border-radius: 4px;
  background: linear-gradient(45deg, #53477A, #8B47A5);
  color: white; /* Set the text color to white, or any other color you prefer */
 
}

.buy:hover {
  background: linear-gradient(135deg, #6c6ced, #3a3ab1); 
}

.buy-offer-button {
  text-align: center;
  margin-top: 10px;
}

.buy-offer {
  padding: 10px 20px;
  background: linear-gradient(135deg,#9b9bdb, #c965c9); 
  border: none;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 18px;
}

.buy-offer:hover {
  background: linear-gradient(135deg, #6c6ced, #3a3ab1); 
}
</style>
