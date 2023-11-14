<template>
  <div>
    <div class="card-container">
      <h2 class="card-title">{{ notice.title }}</h2>

      <div class="card-details">
        <p class="card-description">{{ notice.description }}</p>

        <div class="card-bottom">
          <span class="card-username">{{ notice.user_username }}</span>
          <div v-if="this.$store.getters.thisUser">
            <button @click="ResolveNotice" class="chat-button">Resolve</button>
          </div>
        </div>
      </div>
    </div>

    <ProductModal :visible="showModal" :products="userProducts" @product-selected="handleProductSelected" @close-modal="hideModal"/>

  </div>
</template>

<script>
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js'; 
import ProductModal from '../Products/ProductModal.vue'

export default {
  components: {
    ProductModal
  },
  props: {
    notice: {
      type: Object,
      default: () => ({
        noticeId: 'sample-notice-id',
        description: 'Sample description for the art request. This is just some placeholder text.',
        title: 'Sample Art Request',
        userUID: 'sample-user-uid',
        user_username: 'SampleUser',
        category: 'Sample Category',
        categoryID: 'sample-category-id',
        community: 'Sample Community',
        communityID: 'sample-community-id'
      })
    }
  },
  data() {
    return {
      showModal: false,
      userProducts: [] ,
      noticeIdWanted : ''
    };
  },
  methods: {
    async ResolveNotice() {
      this.noticeIdWanted = this.notice.noticeId; // Assign the value
      this.showModal = true;
      await this.fetchUserProducts();
    },

    hideModal() {
    this.showModal = false;
  },


    resetValues() {
    this.showModal = false;
    this.userProducts = [];
    this.noticeIdWanted = '';
  },



  async createNotification(data) {
        const notificationsCollection = collection(firebase, 'notifications');

        // Add the current timestamp
        data.timestamp = Timestamp.now();

        try {
          const docRef = await addDoc(notificationsCollection, data); 
          const notifId = docRef.id; 

          await docRef.update({ notifId });

          console.log("Notification created successfully with ID:", notifId);
        } catch (error) {
          console.error("Error creating notification:", error);
        }
      },

    async fetchUserProducts() {
      const productsCollection = collection(firebase, 'products');
      const currentUser = this.$store.getters.thisUser;
      console.log(currentUser.uid)
      const q = query(productsCollection, where('uploaderUID', '==', currentUser.uid)); 

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot)
      this.userProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("user products",this.userProducts)
    },

    async handleProductSelected(product) {
  console.log('Selected Product:', product);
  console.log('NoticeId when product selected:', this.notice.noticeId);
  this.showModal = false;

  const notificationData = {
    noticeId: this.notice.noticeId,
    productId: product.id,
    senderUID: this.$store.getters.thisUser.uid,
    senderUsername: this.$store.getters.thisUser.username, 
    targetUID: this.notice.userUID,
    targetUsername: this.notice.user_username
  };

  if(Object.values(notificationData).includes(undefined)){
    console.error("Notification data contains undefined values:", notificationData);
    return;
  }

  console.log("New Notification: ", notificationData);
  await this.createNotification(notificationData);

  this.resetValues(); 
}
  },
  mounted(){
  console.log('Notice in card:', this.notice);
  console.log('NoticeId in card:', this.notice.noticeId);
}
}
</script>

  
  <style>
.card-container {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  position: relative;
  max-width: 500px;
  background: linear-gradient(45deg, #6B5B95, #9B59B6); /* Purple gradient background */
  color: white; /* Makes the default text color white for better visibility on the purple background */
}

.card-title {
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.card-details {
  margin-top: 20px; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  width: 100%;
}

.card-bottom {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-username {
  font-size: 16px;
  font-weight: bold;
}

.card-description {
  font-size: 14px;
  color: white; /* Update description color to white for better visibility */
  font-weight: 400;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.chat-button {
  padding: 5px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.chat-button:hover {
  background-color: #0056b3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* High z-index to make it appear above everything */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 70%; /* Adjust as needed */
  max-height: 80vh;
  overflow-y: auto; /* Scroll if content is too long */
}
</style>
  