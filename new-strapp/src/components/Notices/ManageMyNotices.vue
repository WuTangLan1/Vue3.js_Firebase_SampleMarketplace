<template>
  <div class="manage-notices-container">
    <div v-if="userNotices.length === 0" class="no-notices-message">
      <p>There are no notices available yet. Click below to create one.</p>
    </div>
    <div class="notice-cards">
      <div v-for="(notice, index) in paginatedNotices" :key="notice.documentId" class="notice-card">
        <button @click="deleteNotice(notice.documentId)" class="delete-button">×</button>
        <div class="notice-number">{{ index + 1 }}</div>
        <h2 @click="toggleNoticeDetails(notice)"><u>{{ notice.title }}</u></h2><br>

        <!-- Show "Close notice" button when details are open -->
        <button @click="toggleNoticeDetails(notice)" class="see-more-button" v-if="notice.showDetails">
          Close notice
        </button>

        <!-- Notice details -->


        <transition name="fade-scale">
          <div v-if="notice.showDetails">
          <p><b>Looking for : </b>{{ notice.description }}</p>
          <p><b>Category : </b>{{ notice.category_title }}</p>
          <p>In the <b>{{ notice.community_title }}</b> community</p>
          <button v-if="!notice.resolved" @click="resolveNotice(notice)" class="resolve-button">
            Resolve
          </button>
        </div>
        <button @click="toggleNoticeDetails(notice)" class="see-more-button" v-else>
          Open notice
        </button>
        </transition>
      </div>
    </div> 
    <div class="pagination">
  <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">Previous</button>
  
  <span v-for="page in totalPages" :key="page" class="pagination-number" @click="goToPage(page)" :class="{ active: currentPage === page }">{{ page }}</span>
  
  <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">Next</button>
</div>
<br>
    <router-link to="/CreateNotice" class="create-notice-button">Create Notice</router-link>
  </div>
</template>

<script>
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';

export default {
  data() {
    return {
      userNotices: [],
      currentPage: 1,
      noticesPerPage: 3,
    };
  },
  created() {
    this.fetchUserNotices();
  },
  computed: {
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.noticesPerPage;
      const end = start + this.noticesPerPage;
      return this.userNotices.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.userNotices.length / this.noticesPerPage);
    },
  },
  methods: {
    async fetchUserNotices() {
      const currentUser = await this.$store.getters.thisUser;

      if (!currentUser) return;

      const noticesCollection = collection(firebase, 'communitynotices');
      const q = query(noticesCollection, where('userUID', '==', currentUser.uid));

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          this.userNotices.push({
            documentId: doc.id,
            ...doc.data(),
            showDetails: false, // Initialize showDetails as false
          });
        });
      } catch (error) {
        console.error('Error fetching user notices:', error);
      }
    },
    async resolveNotice(notice) {
      const noticesCollection = collection(firebase, 'communitynotices');
      const noticeDoc = doc(noticesCollection, notice.documentId);

      try {
        await updateDoc(noticeDoc, {
          resolved: true
        });

        // Update the local notice's resolved status as well
        notice.resolved = true;
      } catch (error) {
        console.error('Error resolving notice:', error);
      }
    },
    async deleteNotice(documentId) {
      const noticesCollection = collection(firebase, 'communitynotices');

      try {
        // Delete the notice document from Firestore
        await deleteDoc(doc(noticesCollection, documentId)); 

        this.userNotices = this.userNotices.filter((notice) => notice.documentId !== documentId); 
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    },
    toggleNoticeDetails(notice) {
      // Toggle the showDetails property to show/hide details
      notice.showDetails = !notice.showDetails;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

  
<style>
.manage-notices-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: lightgray;
}


.notice-card {
  width: 100%; /* Make each notice card take up the full width */
  margin: 10px 0; /* Add margin to separate each notice vertically */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f4f4f4;
  position: relative; /* Ensure relative positioning for child absolute elements */
}

.notice-number {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: bold;
  color: #333; /* Adjust the color as needed */
}

.delete-button {
  background-color: transparent;
  color: red;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  vertical-align: top;
}

.delete-button:hover {
  transform: scale(1.2);
}

.notice-card h2 {
  font-size: 18px;
  margin-bottom: 5px;
}

.notice-card p {
  font-size: 14px;
}

.create-notice-button {
  padding: 10px 20px;
  background: linear-gradient(90deg, #003f8f 0%, #002b70 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  letter-spacing: 0.8px;
  font-size: 16px;
  outline: none;
  text-decoration: none; /* Remove default link underline */
}

.create-notice-button:hover {
  background: linear-gradient(90deg, #002b70 0%, #001955 100%);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.create-notice-button:active {
  background: linear-gradient(45deg, #53477A, #8B47A5);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}

.see-more-button {
  font-size: 14px; /* Adjust the font size to make the button smaller */
  padding: 5px 10px; /* Adjust padding to make the button smaller */
  background-color: #3498db; /* Change button background color if needed */
  color: white; /* Change button text color if needed */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.see-more-button:hover {
  background-color: #2980b9; /* Change button background color on hover if needed */
}

.resolve-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #2ecc71; /* Green color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.resolve-button:hover {
  background-color: #27ae60; /* Darker green on hover */
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-scale-enter, .fade-scale-leave-to /* .fade-scale-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.95);
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button, .pagination-number {
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #3498db;
  color: white;
}

.pagination-number {
  background-color: #f2f2f2;
  cursor: pointer;
}

.pagination-number.active {
  background-color: #3498db;
  color: white;
}

.pagination-number:hover:not(.active) {
  background-color: #e0e0e0;
}

.no-notices-message {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 16px;
  font-weight: 500;
  color: #555;
}

</style>
