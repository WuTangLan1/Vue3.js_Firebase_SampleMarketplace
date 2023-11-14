<template>
    <div class="reviews-read-container">
      <div v-if="userReviews.column > 0">
          <div class="review-cards">
            <div v-for="review in userReviews" :key="review.reviewId" class="review-card">
              <h2>Topic: {{ review.topic }}</h2>
              <p>Contents: {{ review.contents }}</p>
              <p>Rating: {{ review.rating }}</p>
            </div>
           </div>
        </div>
        <div v-else>
          <p>You have not yet been reviewed </p>
        </div>
      </div>
  </template>
  
  <script>
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { firebase } from '@/firebase/index.js';

  
  export default {
    props: {
      uid: String,

    },
    data() {
      return {
        userReviews: [],
      };
    },
    async mounted() {
      await this.fetchUserReviews();
    },
    methods: {
      async fetchUserReviews() {
        const reviewsCollection = collection(firebase, 'reviews');
        const newUid = this.uid;
        const q = query(reviewsCollection, where('TargetUserId', '==', newUid));
  
        try {
          const querySnapshot = await getDocs(q);
  
          this.userReviews = querySnapshot.docs.map((doc) => ({
            reviewId: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error('Error fetching user reviews:', error);
        }
      },
    },
    filters: {
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString(); 
      },
    },
  };
  </script>
  
  <style>

  .reviews-read-container {
   max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: lightgray;
  }
  
  .review-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .review-card {
    width: calc(33.33% - 20px);
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: linear-gradient(45deg, #53477A, #8B47A5);
  }
  </style>
  