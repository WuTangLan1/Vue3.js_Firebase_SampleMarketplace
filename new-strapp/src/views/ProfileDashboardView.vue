
<template>
  <div class="profile-dashboard-container">
    <!-- First Row -->
    <div class="row-section">
      <div class="user-me component-container">
        <div class="header">
          <h2 class="section-heading">Your Profile</h2>
          <button @click="minimizedUserMe = !minimizedUserMe" class="minimize-button">
            {{ minimizedUserMe ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedUserMe">
          <user-me />
          <div class="manage-balance-wrapper">
            <ManageBalance :user="user" @user-updated="handleUserUpdated"/>

          </div>
        </div>
      </div>
      <div class="my-products component-container">
        <div class="header">
          <h2 class="section-heading">Your Products</h2>
          <button @click="minimizedMyProducts = !minimizedMyProducts" class="minimize-button">
            {{ minimizedMyProducts ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedMyProducts">
          <my-products />
        </div>
      </div>
    </div>
    
    <!-- Second Row -->
    <div class="row-section">
      <div class="manage-notices component-container">
        <div class="header">
          <h2 class="section-heading">Your Notices</h2>
          <button @click="minimizedManageNotices = !minimizedManageNotices" class="minimize-button">
            {{ minimizedManageNotices ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedManageNotices">
          <manage-notices />
        </div>
      </div>
      <div class="my-favourites component-container" v-if="user && user.uid">
        <div class="header">
          <h2 class="section-heading">Your Favourites</h2>
          <button @click="minimizedMyFavourites = !minimizedMyFavourites" class="minimize-button">
            {{ minimizedMyFavourites ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedMyFavourites">
          <my-favourites />
        </div>
      </div>
    </div>

    <!-- Third Row -->
    <div class="row-section">
      <div class="my-transactions component-container">
        <div class="header">
          <h2 class="section-heading">Your Transactions</h2>
          <button @click="minimizedMyTransactions = !minimizedMyTransactions" class="minimize-button">
            {{ minimizedMyTransactions ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedMyTransactions">
          <my-transactions />
        </div>
      </div>
      <div class="reviews-read component-container" v-if="user && user.uid">
        <div class="header">
          <h2 class="section-heading">Your Reviews</h2>
          <button @click="minimizedReviewsRead = !minimizedReviewsRead" class="minimize-button">
            {{ minimizedReviewsRead ? '+' : '-' }}
          </button>
        </div>
        <div v-if="!minimizedReviewsRead">
          <reviews-read :uid="user.uid" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import UserMe from "../components/Users/UserMe.vue";
import MyProducts from "../components/Products/MyProducts.vue";
import ReviewsRead from "../components/Users/Reviews/ReviewsRead.vue";
import MyTransactions from "../components/Transactions/MyTransactions.vue";
import ManageNotices from "../components/Notices/ManageMyNotices.vue";
import MyFavourites from "../components/Favourites/myFavourites.vue";
import ManageBalance from "../components/Users/ManageBalance.vue";




export default {
  components: {
    UserMe,
    MyProducts,
    ReviewsRead,
    MyTransactions,
    ManageNotices,
    MyFavourites,
    ManageBalance
  },

  data() {
  return {
    user: '',
    minimizedUserMe: false,
    minimizedMyProducts: false,
    minimizedManageNotices: false,
    minimizedMyTransactions: false,
    minimizedMyFavourites: false,
    minimizedReviewsRead: false
  };
},
methods :{
  handleUserUpdated(updatedUser) 
  {
    this.user = updatedUser;
  }
},

  mounted() {
    // Fetch the user data from the store here
    this.user = this.$store.getters.thisUser;
    console.log('ChecKING HERE:', this.user)
  },
};
</script>

<style scoped>
.section-heading {
  font-family: Impact;
  color: #fff;
}

.profile-dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 20px;
}

.row-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  margin-bottom: 20px;
}

.component-container {
  flex: 1;
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #c965c9;
  padding: 20px;
  min-width: 0;
  overflow: hidden;
}

.user-me {
  flex: 1;
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #c965c9;
  padding: 20px;
  min-width: 0; 
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: center; 
  position: relative;

}

.user-me .header {
  align-self: flex-start; /* This makes sure the header aligns to the top left */
  width: 100%; /* This makes sure the header spans the full width of its container */
  display: flex;
  justify-content: space-between; /* This will push the heading to the left and the button to the right */
  align-items: center;
}

/* This ensures the minimize button is always positioned at the top right */
.user-me .minimize-button {
  position: absolute;
  top: 10px;  /* adjust as necessary */
  right: 10px;  /* adjust as necessary */
}
.manage-balance-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin-top: 20px;  /* This line adds space above the manage-balance-wrapper */
}


/* Media Queries for Responsive Design */
@media (max-width: 768px) {
  .row-section {
    flex-direction: column;
  }

  .component-container {
    max-height: 300px; 
    overflow-y: auto; 
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minimize-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #fff;
  transition: transform 0.3s;
}

.minimize-button:hover {
  transform: scale(1.1);
}

</style>
