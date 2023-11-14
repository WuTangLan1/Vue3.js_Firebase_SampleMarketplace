<template>
    <div class="notifications-container">
      <div class="filter-switch">
        <button @click="switchFilter" class="switch-button">
          Switch to {{ filterType === 'incoming' ? 'Outgoing' : 'Incoming' }} Notifications
        </button>
      </div>
      <div class="notifications-list">
        <transition name="card-transition" mode="out-in">
          <div :key="transitionKey">
            <div v-for="notification in filteredNotifications" :key="notification.noticeId" class="notification-card">
                <h3>{{ notification.senderUsername }} sent a notification to {{ notification.targetUsername }}</h3>
                <p v-html="truncateDescription(notices[notification.noticeId]?.description)"></p>

                <div class="product-details">

                    <div class="product-info">
                      <div class="product-image-container">
                        <img :src="products[notification.productId]?.ProductImages[0]" alt="Product Image" class="product-image"/>
                      </div>
                      <h4 v-html="truncateTitle(products[notification.productId]?.Title)"></h4>

                        <p><strong>Price:</strong> {{ products[notification.productId]?.Price }}</p>
                    </div>
                </div>
            </div>
          </div>
        </transition>
      </div>
        <div class="pagination-controls">
        <button @click="previousPage" :disabled="currentPage <= 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
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
        notifications: [],
        products: {},
        notices: {},  // New property for storing the notices
        filterType: 'incoming',
        transitionKey: 0,
        currentPage: 1,
        itemsPerPage: 1,
      };
    },
    computed: {
      filteredNotifications() {
        let start = (this.currentPage - 1) * this.itemsPerPage;
        let end = this.currentPage * this.itemsPerPage;
  
        return this.filterType === 'incoming' ? 
          this.notifications.filter(notification => notification.targetUID === this.uid).slice(start, end) :
          this.notifications.filter(notification => notification.senderUID === this.uid).slice(start, end);
      },
      totalItems() {
        return this.filterType === 'incoming' ? 
          this.notifications.filter(notification => notification.targetUID === this.uid).length :
          this.notifications.filter(notification => notification.senderUID === this.uid).length;
      },
      totalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
      }
    },
    methods: {
      async fetchNotifications() {
        const notificationsRef = collection(firestore, 'notifications');
        const productsRef = collection(firestore, 'products');
        const noticesRef = collection(firestore, 'communitynotices');  // Reference to the notices collection
  
        const incomingNotificationsQuery = query(notificationsRef, where('targetUID', '==', this.uid));
        const incomingNotificationsSnapshot = await getDocs(incomingNotificationsQuery);
  
        const outgoingNotificationsQuery = query(notificationsRef, where('senderUID', '==', this.uid));
        const outgoingNotificationsSnapshot = await getDocs(outgoingNotificationsQuery);
  
        const allNotifications = [...incomingNotificationsSnapshot.docs, ...outgoingNotificationsSnapshot.docs].map(doc => doc.data());
        this.notifications = allNotifications;
  
        for (const notification of this.notifications) {
          // Fetch products
          const productDoc = await getDoc(doc(productsRef, notification.productId));
          if (productDoc.exists()) {
            this.products[notification.productId] = productDoc.data();
          }
          
          // Fetch the corresponding notice
          const noticeDoc = await getDoc(doc(noticesRef, notification.noticeId));
          if (noticeDoc.exists()) {
            this.notices[notification.noticeId] = noticeDoc.data();
            console.log(this.notices[notification.noticeId])
          }
        }
      },
      truncateTitle(title) {
        if (!title || title.length <= 20) return title;

        let end = 20;
        while (end > 0 && title[end] !== ' ') {
          end--;
        }

        return title.substring(0, end) + (end !== 20 ? '<br>' + title.substring(end + 1) : '');
      },
      truncateDescription(description) {
            if (!description) return "";

            let chunks = [];
            let i = 0;

            while (i < description.length) {
                let end = i + 50;
                if (end < description.length) {
                while (end > i && description[end] !== ' ') {
                    end--;
                }
                }
                chunks.push(description.substring(i, end));
                i = end + 1;
            }

            return chunks.join('<br>');
            }
,

      switchFilter() {
        this.filterType = this.filterType === 'incoming' ? 'outgoing' : 'incoming';
        this.transitionKey++;
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.transitionKey++;
        }
      },
      previousPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.transitionKey++;
        }
      }
    },
    created() {
      this.fetchNotifications();
    }
  }
  </script>
  
  
  <style scoped>

.notifications-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%; 
  padding: 0 5%; 
}

.notification-card {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 15px;
  background-color: #FFF3E0;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: box-shadow 0.3s;
  padding-bottom: 10px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  width: 90%; 
  margin: 20px auto; 
}
  .notifications-container {
    font-family: 'Arial', sans-serif;
    max-width: 1000px;
    min-width: 500px;
    margin: 20px auto;
    padding: 10px;
    border-radius: 8px;
    background: #f5f5f5;
  }

  .product-details {
        display: flex;  /* making it a flex container to align image and text side by side */
        align-items: center;  /* vertically centering the items */
        margin-top: 20px;  /* added some top margin for separation */
    }

    .product-image {
  max-width: 100px; 
  max-height: 100px;
  border-radius: 0; /* Add this line to ensure the image is a rectangle */
}

.product-image-container {
        flex: 1; /* This will allow the image container to take up available space */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .product-info {
        flex: 2;  /* This will give the text double the space of the image */
        padding-left: 15px; 
        background-color: #86b0ff; /* Added some padding for separation from the image */
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
  

  .notification-card:hover {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-transition-enter-active, .card-transition-leave-active {
    transition: opacity 0.5s;
  }
  .card-transition-enter, .card-transition-leave-to /* .card-transition-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  