<template>
  <div class="transaction-container">
    <!-- Review and Rating Section for Transaction -->
    <div class="review-rating-section">
      <h3>Review and Rate the Transaction</h3>
      <textarea v-model="transactionReview" placeholder="Write your review here..." class="review-textarea"></textarea>
      <div class="rating-stars">
        <span v-for="star in 5" :key="'transaction-' + star" @click="setTransactionRating(star)" class="star" :class="{ 'star-selected': star <= transactionRating }">&#9733;</span>
      </div>
    </div>

    <!-- Review and Rating Section for Product -->
    <div class="review-rating-section">
      <h3>Review and Rate the Product</h3>
      <textarea v-model="productReview" placeholder="Write your review here..." class="review-textarea"></textarea>
      <div class="rating-stars">
        <span v-for="star in 5" :key="'product-' + star" @click="setProductRating(star)" class="star" :class="{ 'star-selected': star <= productRating }">&#9733;</span>
      </div>
    </div>

    <!-- Review and Rating Section for Seller -->
    <div class="review-rating-section">
      <h3>Review and Rate the Seller</h3>
      <textarea v-model="sellerReview" placeholder="Write your review here..." class="review-textarea"></textarea>
      <div class="rating-stars">
        <span v-for="star in 5" :key="'seller-' + star" @click="setSellerRating(star)" class="star" :class="{ 'star-selected': star <= sellerRating }">&#9733;</span>
      </div>
    </div>

    <button class="submit-review-button" @click="submitReviews">Submit Reviews</button>
  </div>
</template>

<script>
import { collection, addDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';
export default {
  data() {
    return {
      transactionReview: '',
      transactionRating: 0,
      productReview: '',
      productRating: 0,
      sellerReview: '',
      sellerRating: 0,
    };
  },
  methods: {
    setTransactionRating(star) {
      this.transactionRating = star;
    },
    setProductRating(star) {
      this.productRating = star;
    },
    setSellerRating(star) {
      this.sellerRating = star;
    },
    submitReviews() {
      const reviews = {
        transactionReview: this.transactionReview,
        transactionRating: this.transactionRating,
        productReview: this.productReview,
        productRating: this.productRating,
        sellerReview: this.sellerReview,
        sellerRating: this.sellerRating,
        // Include other relevant data
      };

      const reviewCollection = collection(firebase, 'reviews');
      addDoc(reviewCollection, reviews)
        .then(() => {
          console.log('Reviews added successfully!');
          // Additional logic can be added here if needed
        })
        .catch((error) => {
          console.error('Error adding reviews:', error);
        });
    },
  },
};
</script>

<style>
  /* Add or modify any necessary CSS styles here */
  .review-rating-section {
    margin-top: 20px;
  }

  h3 {
    font-family: Impact;
  }

  .review-textarea {
    width: 60%;
    height: 100px;
    margin-bottom: 10px;
    padding: 10px;
  }

  .rating-stars {
    margin-bottom: 10px;
  }

  .star {
    font-size: 24px;
    color: #888;
    cursor: pointer;
  }

  .star-selected {
    color: gold;
  }

  .submit-review-button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #c965c9, #6c6ced);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  .submit-review-button:hover {
    background: linear-gradient(135deg, #6c6ced, #3a3ab1);
  }

  .submit-review-button:active {
    background: linear-gradient(135deg, #6c6ced, #3a3ab1);
  }
</style>
