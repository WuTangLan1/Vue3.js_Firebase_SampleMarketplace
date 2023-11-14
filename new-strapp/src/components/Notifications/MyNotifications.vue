<template>
  <div class="notifications-container">
    
    <!-- Header section -->
    <div class="header-section">
  <h1>Your Notifications</h1>
  
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

<div v-if="notifications.length === 0" class="empty-state">
    You don't have any notifications at the moment.
</div>

    <div v-else class="notification-card-wrapper">
      <div 
        v-for="notification in pagedNotifications" 
        :key="notification.notifId" 
        class="notification-card"
        :class="filterState === 'incoming' ? 'incoming-card' : 'outgoing-card'">
        
        <div class="product-image">
          <img v-if="notification.productFirstImage" :src="notification.productFirstImage" alt="Product Image">
        </div>

        <div class="message-content">
          <span class="close-icon" @click="removeNotification(notification.notifId)">×</span>
          <template v-if="filterState === 'incoming'">
            <span class="highlight">{{notification.senderUsername}}</span> wants you to see this 
            <span class="highlight">{{ notification.productTitle }}</span>, 
            which they think you are looking for in this notice 
            <span class="highlight">{{ notification.noticeTitle }}</span> with 
            this request <span class="highlight">{{ notification.noticeDescription }}</span>.
          </template>
          
          <template v-else>
            You recommended <span class="highlight">{{ notification.productTitle }}</span> to 
            <span class="highlight">{{notification.targetUsername}}</span> for their notice titled 
            <span class="highlight">{{ notification.noticeTitle }}</span>, where they requested 
            <span class="highlight">{{ notification.noticeDescription }}</span>.

          </template>
        </div>

        <div class="card-footer">
          <button class="see-more-btn" @click="logProductId(notification.productId)">See More</button>
        </div>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="pagination">
      <button @click="prevPage" :disabled="page === 1">Previous</button>
      <span>Page {{ page }} </span>
      <button @click="nextPage" :disabled="page === totalPages">Next</button>
    </div>
  </div>
</template>


<script>
import { ref, onMounted , computed} from 'vue';
import { useStore } from 'vuex';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';
import { useRouter } from 'vue-router';

export default {
  name: 'MyNotifications',
  
  setup() {
    const store = useStore();
    const notifications = ref([]);
    const router = useRouter();
    const filterState = ref('incoming');  // Default to 'incoming'
    const isIncoming = computed({
  get: () => filterState.value === 'incoming',
  set: (newValue) => {
    filterState.value = newValue ? 'incoming' : 'outgoing';
  }
});

const toggleFilter = () => {
  isIncoming.value = !isIncoming.value;

}


const setFilterState = (state) => {
  filterState.value = state;
  notifications.value = []; // Clear the existing notifications
  fetchUserNotifications(); // Fetch notifications based on the new filter state
};


      const page = ref(1); // Starting page number
    const perPage = 2;  // Number of notifications per page

    const start = computed(() => (page.value - 1) * perPage);
    const end = computed(() => page.value * perPage);

    const pagedNotifications = computed(() => {
      return notifications.value.slice(start.value, end.value);
    });

    const totalPages = computed(() => {
  return Math.ceil(notifications.value.length / perPage);
});


const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value += 1;
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value -= 1;
  }
};



    const removeNotification = async (notifId) => {
      // Remove the notification from the Firebase collection
      const notificationsCollection = collection(firebase, 'notifications');
      await deleteDoc(doc(notificationsCollection, notifId));

      // Remove the notification from the local state
      notifications.value = notifications.value.filter(notif => notif.notifId !== notifId);
    }

    const logProductId = (productId) => {
      router.push({name : 'ProductFeatureDetails', params:{id:productId}})
    }

    const fetchUserNotifications = async () => {
      const currentUser = store.getters.thisUser;

      if (!currentUser) return;

      const notificationsCollection = collection(firebase, 'notifications');
      let q;

if (filterState.value === 'incoming') {
  q = query(notificationsCollection, where('targetUID', '==', currentUser.uid));
} else {
  q = query(notificationsCollection, where('senderUID', '==', currentUser.uid));
}
const productsCollection = collection(firebase, 'products');
const noticesCollection = collection(firebase, 'communitynotices');



      try {
        const querySnapshot = await getDocs(q);
        
        for (let notificationDoc of querySnapshot.docs) {
          let notifData = notificationDoc.data();

          // Get product details
          const productQuery = query(productsCollection, where('productID', '==', notifData.productId));
          const productSnapshot = await getDocs(productQuery);
          const productData = productSnapshot.docs[0]?.data();

          // Get notice details
          const noticeDocRef = doc(noticesCollection, notifData.noticeId);
          const noticeSnapshot = await getDoc(noticeDocRef);
          const noticeData = noticeSnapshot.data();

          notifications.value.push({
            notifId: notificationDoc.id,
            ...notifData,
            productTitle: productData?.Title,
            productDescription: productData?.Description,
            productFirstImage: productData?.ProductImages[0],
            noticeTitle: noticeData?.title,
            noticeDescription: noticeData?.description
          });
        }
      } catch (error) {
        console.error('Error fetching user notifications:', error);
      }
    }

    onMounted(fetchUserNotifications);
  
    return {
  notifications,
  removeNotification,
  logProductId,
  toggleFilter,
  filterState,
  nextPage,
  prevPage,
  pagedNotifications,
  page,
  totalPages,
  setFilterState,
}

  },
}

</script>

<style scoped>

.notifications-container {
  max-width: 750px;
  margin: 50px auto;
  padding: 20px 25px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;   /* To align items vertically centered */
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 15px;
  margin-bottom: 25px;
}

.notifications-container h1 {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 600;
  color: #333;
}

.segmented-controls {
  display: flex;
  border: 1px solid #007BFF;
  border-radius: 30px;
  overflow: hidden;
}

.segmented-controls button {
  flex: 1;
  background: transparent;
  color: #007BFF;
  padding: 8px 15px;
  font-weight: 500;
}

.segmented-controls button.active {
  background: #007BFF;
  color: #FFF;
}

.notification-card-wrapper {
  margin: 0 -15px;
  padding: 0 15px; /* New line added */
}


.notification-card {
  display: flex;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}
.title-wrapper {
  display: flex;
  align-items: center;  
  gap: 20px;  
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #666;
  font-size: 1.3em;
}

.notification-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.product-image {
  width: 100px;
  margin-right: 25px;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.see-more-btn {
  position: absolute;
  bottom: 0px; /* Adjusted value */
  left: 50%;
  transform: translateX(-50%); /* Center the button */
  font-size: 1rem;
  padding: 8px 15px; /* Increased padding for a better look */
  background-color: #007BFF;
  color: white;
  border: none; /* New line added to remove any default border */
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Shadow for depth */
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out; /* Transition for hover effect */
}

.see-more-btn:hover {
  background-color: #005bb5; /* Slightly darker color on hover */
  transform: translateX(-50%) translateY(-2px); /* Elevate the button a bit on hover */
}

.message-content {
  flex: 1;
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  font-size: 1.2em;
  color: #aaa;
}

.highlight {
  font-weight: 600;
  color: #007BFF;
}

.incoming-card {
  background-color: #f3f4f6;
}

.outgoing-card {
  background-color: #e7f1fa;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  padding: 0 15px;
}

.pagination button {
  padding: 10px 20px;
  border-radius: 15px;
  background-color: #007BFF;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  font-weight: 500;
}

.pagination button:disabled {
  background-color: #b5b5b5;
  cursor: default;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
  color: #666;
  font-size: 1.3em;
}

</style>
