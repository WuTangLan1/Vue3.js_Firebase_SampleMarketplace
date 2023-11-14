<template>
  <div class="transaction-container">
    <div class="transaction-header">
      <h2 class="transaction-title">Transaction Confirmation</h2>
    </div>
    <div class="current-time-top">
      <p><strong>Current Time:</strong> {{ formatLiveClock(currentTime) }}</p>
    </div>
    <!-- Order Summary Container (conditionally rendered) -->
    <div class="order-summary" v-if="productData">
    <h3>Order Summary</h3>
    <div class="product-info">
        <div class="product-images">
            <img
                v-for="(img, index) in productData.ProductImages"
                :src="img"
                :alt="'Product Image ' + (index + 1)"
                :key="index"
                class="product-image"
            />
        </div>
        <div class="product-details">
            <p class="product-title"><strong>Product Title:</strong> {{ productData.Title }}</p>
            <p class="product-description"><strong>Description:</strong> {{ productData.Description }}</p>
            <p class="product-price"><strong>Price:</strong> R{{ productData.Price }}</p>
            <p class="product-quantity"><strong>Quantity:</strong> {{ productData.AvailableQntty }}</p>
            <p class="product-servicefee"><strong>Service Fee:</strong> R{{ (productData.Price * 0.15).toFixed(2) }}</p>
            <p class="product-total"><strong>Total Amount:</strong> R{{ (productData.Price * productData.AvailableQntty + productData.Price * 0.15).toFixed(2) }}</p>
        </div>
    </div>
</div>


    <!-- Delivery Container -->
    <div class="delivery-container">
    <h3 class="white-header">Delivery Information</h3>
    <div class="delivery-method">
        <button @click="toggleDeliveryMethod('collect')" :class="{ 'active': deliveryMethod === 'collect' }">Collect</button>
        <button @click="toggleDeliveryMethod('deliver')" :class="{ 'active': deliveryMethod === 'deliver' }">Deliver</button> <br><br>
    </div>

      <!-- Address Fields (displayed when 'Deliver' is selected) -->
      <div v-if="deliveryMethod === 'deliver'" class="delivery-details">
        <input type="text" placeholder="Address" v-model="deliveryAddress" />
        <input type="text" placeholder="Name" v-model="deliveryName" />
        <input type="text" placeholder="Email" v-model="deliveryEmail" />
        <input type="text" placeholder="Cell Number" v-model="deliveryCellNumber" />
      </div>

      <!-- Pickup Message (displayed when 'Collect' is selected) -->
      <div v-if="deliveryMethod === 'collect'" class="pickup-message">
        Please pick up your order at XYZ location.
      </div>
    </div>

    <!-- Payment Method Container -->
    <div class="payment-method">
    <h3 class="white-header">Payment Method</h3>
    <div class="payment-options">
        <label class="payment-option">
            <input type="radio" v-model="selectedPaymentMethod" value="eft" /> EFT
        </label>
        <label class="payment-option">
            <input type="radio" v-model="selectedPaymentMethod" value="snapscan" /> SnapScan
        </label>
        <label class="payment-option">
            <input type="radio" v-model="selectedPaymentMethod" value="zapper" /> Zapper
        </label>
    </div>



      <!-- Card Details Fields (displayed when 'EFT' is selected) -->
      <div v-if="selectedPaymentMethod === 'eft'" class="card-details">
        <input type="text" placeholder="Card Number" v-model="cardNumber" @input="formatCardNumber" />
        <input type="text" placeholder="Expiration Date (MM/YYYY)" v-model="expirationDate" @input="formatExpirationDate" />
        <input type="password" placeholder="CVV" v-model="cvv" />
      </div>
    </div>
    <div v-if="selectedPaymentMethod === 'snapscan'" class="payment-image">
      <img src="@/assets/images/Snapscan.jpg" alt="SnapScan Image" />
    </div>
    <div v-if="selectedPaymentMethod === 'zapper'" class="payment-image">
      <img src="@/assets/images/Zapper.jpg" alt="Zapper Image" />
    </div> <br>


    <!-- Complete Transaction Button --> 
    <button class="complete-button" @click="completeTransaction" :disabled="loading">
      {{ loading ? 'Completing Transaction...' : 'Complete Transaction' }}
    </button>
    <!-- Transaction Result -->
    <transition name="fade">
      <div class="transaction-result" v-if="transactionResult !== null">
        <div :class="transactionResultClass">
          <p>{{ transactionResultMessage }}</p>
          <button @click="resetTransaction">OK</button>
        </div>
      </div>
    </transition>
    <router-link :to="{ name: 'ProductList' }" class="link">
  <button class="gradient-button">
    {{ loading ? 'Back...' : 'Back' }}
  </button>
</router-link>


  </div>
</template>

<script>
import router from '@/router/index'; // Replace with the actual path to your router configuration file
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js'

// import { firebase, storage } from "@/firebase/index.js";

export default {
  
  created() {
    console.log('Received productData:', this.$route.query.productData);

    if (typeof this.$route.query.productData === 'string') {
      this.productData = JSON.parse(this.$route.query.productData);
    } else {
      this.productData = this.$route.query.productData;
    }

    setInterval(() => {
    this.currentTime = new Date();
  }, 1000); 
  },
  data() {
    return {
      productData: null, // Ensured that the productData property is initialized to null
      newTransaction: null,
      deliveryMethod: '',
      deliveryAddress: '',
      deliveryName: '',
      deliveryEmail: '',
      deliveryCellNumber: '',
      selectedPaymentMethod: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      currentTime: new Date(),
      transactionResult: null, //
      transactionSuccess: false, 
    };
  },
  methods: {
    formatLiveClock(date) {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleTimeString('en-UK', options);
  },
    toggleDeliveryMethod(method) {
      this.deliveryMethod = method;
    },
    formatCardNumber() {
      // Format cardNumber as groups of 4 digits
      this.cardNumber = this.cardNumber.replace(/\D/g, '').slice(0, 16); // Ensure a maximum of 16 digits
      this.cardNumber = this.cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    },

    formatExpirationDate() {
      // Format expirationDate as MM/YYYY
      this.expirationDate = this.expirationDate.replace(/\D/g, '').slice(0, 6); // Ensure a maximum of 6 characters
      this.expirationDate = this.expirationDate.replace(/(\d{2})(\d{0,4})/, '$1/$2').trim();
    },

    formatCVV() {
  // Remove any non-digit characters and limit to 3 digits
  this.cvv = this.cvv.replace(/\D/g, '').slice(0, 3);
},
completeTransaction() {
  // Show loading sign
  this.loading = true;

  // Simulate a delay (replace this with your actual transaction logic)
  setTimeout(async () => {
    // Hide loading sign
    this.loading = false;

    // Simulate a successful transaction
    // Replace this with your actual success/failure logic
    const success = Math.random() > 0.5; // Simulate a random success or failure

    // Try to add the transaction to Firebase
    const transactionCollection = collection(firebase, 'transactions');

    this.newTransaction = {
          // ... populate with transaction data
          transactiondate: new Date(), // Example: timestamp of the transaction
          // dateOfAgreement: this.dateOfAgreement,
          productId: this.productData.productID,
          productTitle: this.productData.Title, // Example: product title
          productDescritpion: this.productData.Description,
          sellerid: this.productData.uploaderUID,
          // buyerid: this.productData.buyerUID,
          productPrice: this.productData.Price,
          serviceFee: this.productData.Price * 0.15,
          totalAmount: this.productData.Price * this.productData.AvailableQntty + this.productData.Price * 0.15,
        };
    try {
      const transactionRef = await addDoc(transactionCollection, this.newTransaction);
      console.log('Transaction successfully added to Firebase:', transactionRef.id);

      const productDocRef = doc(firebase, 'products', this.productData.productID);
      await updateDoc(productDocRef, {
        isAvailable: false,
      });
      console.log('Product data updated to set isAvailable to false.');
    } catch (error) {
      console.error('Error adding transaction to Firestore:', error);
      // Handle the error here
      return;
    }

    // Set the transaction result based on the success/failure
    this.transactionResult = success ? 'success' : 'failure';

    if (success) {
      this.transactionSuccess = true;
      this.transactionDate = new Date();
    }

    console.log('Transaction completed!');
  }, 1000); // Simulate a 1-second delay (adjust as needed)
},


    resetTransaction() {
      // Reset the transaction form and result
      this.transactionResult = null;

      // Reset other form fields if needed
      // ...
      if (this.transactionSuccess) {
    this.transactionSuccess = false; // Reset the flag
    router.push({ name: 'Home' }); // Replace 'home' with the name of your homepage route
  }
      console.log("Transaction reset!");
    },
  },

  computed: {
    transactionResultClass() {
      return {
        "transaction-success": this.transactionResult === "success",
        "transaction-failure": this.transactionResult === "failure",
      };
    },

    transactionResultMessage() {
      return this.transactionResult === "success"
        ? "Transaction completed successfully!"
        : "Transaction failed. Please check your information and try again.";
    },

  },
};
</script>

<style scoped>
/* Styling for the transaction page */
.transaction-container {
  background-color: #fff;
  padding: 20px;
  border: 5px solid transparent; /* Set border to transparent initially */
  border-image: linear-gradient(to right, #007bff, #b57bff); /* Create a gradient border */
  border-image-slice: 1; /* Ensure the entire border area is covered */
  border-radius: 8px;
  margin: 20px auto;
  width: 80%;
  max-width: 600px;
}
.transaction-result {
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.transaction-success {
  background-color: #00c853; /* Green for success */
  color: #fff;
}

.transaction-failure {
  background-color: #ff1744; /* Red for failure */
  color: #fff;
}

.transaction-result p {
  font-size: 24px;
  margin-bottom: 20px;
}

.transaction-result button {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.transaction-result button:hover {
  background-color: #0056b3;
}

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.transaction-header {
  text-align: center;
}

.transaction-title {
  font-size: 24px;
  color: #333;
}

.section-title {
  font-size: 20px;
  color: white;
  margin-top: 20px;
}

/* Styling for input fields */
.input-field {
  width: 100%;
  padding: 20px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Styling for buttons */
.button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.payment-image-size {
  max-width: 200px; /* Set a maximum width for the payment images */
  max-height: 100px;
}
.complete-button {
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 20px;
}

.complete-button:hover {
  background-color: #b57bff;
}

.active {
  background-color: #0056b3;
  color: white;
}

/* Styling for product information */
.product-info {
  display: flex;
  background: linear-gradient(to bottom, #0056b3, #b57bff);
  border: 1px solid #fff; /* Add a border around the product info container */
  border-radius: 4px; /* Add border radius for rounded corners */
  padding: 10px; /* Add some padding to the product info container */
  margin-top: 10px; /* Adjust margin for spacing */
  color: white;
}

.product-images {
  flex: 1;
  padding: 10px; /* Add padding to the product images container */
}

.product-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 4px;
}

.product-details {
  flex: 2;
  padding-left: 20px;
}

/* Styling for delivery and payment options */
.delivery-container,
.payment-method {
  margin-top: 20px;
  background: linear-gradient(to bottom, #0056b3, #b57bff);
}

/* Styling for pickup message */
.pickup-message {
  font-style: italic;
  margin-top: 10px;
  color: #fff;
  border-radius: 4px;
  border-image: linear-gradient(to right, #007bff, #b57bff); /* Create a gradient border */
  border-image-slice: 1; /* Ensure the entire border area is covered */
}
.delivery-method button {
    margin-right: 10px; /* Adjust the margin as needed */
}
.white-header {
    background-color: white;
    padding: 10px; /* Add padding for spacing, adjust as needed */
}
.payment-option {
    padding: 5px; /* Adjust the padding as needed for spacing */
}
.order-summary {
    background-color: #f5f5f5;
    padding: 20px;
    border: 1px solid #ddd;
}

.product-info {
    display: flex;
    align-items: center;
}

.product-images {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-image {
    max-width: 100px;
    max-height: 100px;
}

.product-details {
    flex: 2;
    padding-left: 20px;
}

.product-title, .product-description, .product-price, .product-quantity, .product-servicefee, .product-total {
    margin: 10px 0;
}
.gradient-button {
  border-radius: 4px;
  background: linear-gradient(45deg, #53477A, #8B47A5);
  color: white; /* Set the text color to white, or any other color you prefer */
 
}



</style>
