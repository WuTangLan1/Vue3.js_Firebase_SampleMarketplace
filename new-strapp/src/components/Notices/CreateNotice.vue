<template>
  <div class="create-notice-container">
    <h1>Create a New Notice</h1>
    <form @submit.prevent="createNotice" class="notice-form">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="notice.title" required class="form-input" :disabled="loading" />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="notice.description" required class="form-input" :disabled="loading"></textarea>
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <select v-model="notice.category_title" required class="form-input-dropdown" :disabled="loading">
          <option value="" :disabled="loading">Select Category</option>
          <option v-for="category in categories" :value="category.title" :key="category.id">{{ category.title }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="community">Community:</label>
        <select v-model="notice.community_title" required class="form-input-dropdown">
          <option value="" :disabled="loading">Select Community</option>
          <option v-for="community in communities" :value="community.title" :key="community.id">{{ community.title }}</option>
        </select>
      </div>
      <button type="submit" class="submit-button" @click="ValidateNotice" :disabled="loading">
        <span v-if="loading">
          <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </span>
        <span v-else>
          Create Notice
        </span>
      </button>
    </form>
  </div>
  <div class="modal fade" id="popupMessageModal" tabindex="-1" role="dialog" aria-labelledby="popupMessageModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="popupMessageModalLabel">Notice</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Please select a community and category before creating a notice.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, setDoc, getDocs, query, where, doc } from 'firebase/firestore'
import { firebase } from '@/firebase/index.js'
import router from '@/router/index.js';
import { uuid } from 'vue-uuid';

  // You might need to define or import `noticesCollection` somewhere here
  
  export default {
    data() {
      return {
        notice: {
          title: '',
          description: '',
          categoryId: '',
          category_title: 'Select Category',
          communityId : '',
          community_title: 'Select Community',
          user_username: '',
          userUID: '',
          uploadDate: '',
          resolved: false
        },
        categoryDocument: null,
        communityDocument : null,
        loading: false,
        categories: [],
        communities: [],
      }
    },
    async mounted() {
    // Fetch categories and communities when the component is mounted
    await this.fetchCategories();
    await this.fetchCommunities();
  },
    methods: {
      async fetchCategories() {
      const categoriesCollection = collection(firebase, 'categories');
      const querySnapshot = await getDocs(categoriesCollection);

      this.categories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
      }));
    },
    
    async fetchCommunities() {
      const communitiesCollection = collection(firebase, 'communities');
      const querySnapshot = await getDocs(communitiesCollection);

      this.communities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
      }));
    },
    ValidateNotice() {
    if (
      this.notice.community_title === 'Select Community' ||
      this.notice.category_title === 'Select Category'
    ) {
      ('#popupMessageModal').modal('show'); // Show the modal
      return;
     }

    },
      async createNotice() {
        this.loading = true
        try {
          const currentUser = await this.$store.getters.thisUser
          
          const categoryTitle = this.notice.category_title;
          const communityTitle = this.notice.community_title;
          
          if(communityTitle)
          {
            const communitiesCollection = collection(firebase, 'communities');
            const qu = query(communitiesCollection, where('title', '==', communityTitle));
            const qusnap = await getDocs(qu);

            if (qusnap.size > 0)
            {
             this.communityDocument = qusnap.docs[0]; 
            }
            else 
            { 
              console.warn('Category not found:', this.notice.community_title);
            }
          }

          if(categoryTitle)
          {
          const categoriesCollection = collection(firebase, 'categories');

          const q = query(categoriesCollection, where('title', '==', categoryTitle));
          const querySnapshot = await getDocs(q);


          if (querySnapshot.size > 0) {
            this.categoryDocument = querySnapshot.docs[0];
          } else {
            console.warn('Category not found:', this.notice.category_title);
          }
          } 

          const catId = this.categoryDocument.data().categoryId
          const commId = this.communityDocument.data().communityId

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString("YYYY-MM-DD HH:MM:SS");
          
          const newNotice = {
            communityId : commId,
            community_title: this.notice.community_title,
            userUID: currentUser.uid,
            user_username: currentUser.username,
            title: this.notice.title,
            description: this.notice.description,
            category_title : this.notice.category_title,
            categoryId : catId,
            uploadDate : formattedDate,
            resolved: this.notice.resolved,
            noticeId: uuid.v1()
          }

  
          if (
            newNotice.community_title &&
            newNotice.userUID &&
            newNotice.user_username &&
            newNotice.title &&
            newNotice.description
          ) {
            const noticeId = newNotice.noticeId
            const noticesCollection = collection(firebase, 'communitynotices')
            const noticeRef = doc(noticesCollection,noticeId)
            await setDoc(noticeRef, newNotice)
            router.push({ name: 'UserMe' });
          }
          else {
            console.log('did not work')
          }
        } catch (error) {
          console.error('Error creating notice:', error)
        } finally {
          this.loading = false;
        }
      }
    }
  }
  </script>
 <style>
 .create-notice-container {
   width: 100%;
   max-width: 450px;
   margin: 0 auto;
   padding: 20px;
   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   border-radius: 8px;
   background: linear-gradient(135deg, #c965c9, #6c6ced); /* Adjust background color as needed */
   text-align: center;
 }
 
 h1 {
   color: #fff; /* Adjust color as needed */
   font-family: Impact;
 }
 .create-notice-container h1 {
  color: #fff; /* Adjust color as needed */
}
 
 .form-group {
   margin-bottom: 20px;
   background-color: linear-gradient(135deg, #c965c9, #6c6ced);
 }
 
 label {
   font-weight: bold;
   color: #fff; /* Adjust color as needed */
 }
 
 .form-input {
   width: 100%;
   padding: 12px;
   border: 1px solid #fff; /* Adjust border color as needed */
   border-radius: 4px;
   font-size: 15px;
   outline: none;
   transition: border-color 0.3s;
   background: #fff; /* Adjust background color as needed */
 }
 
 .form-input:focus {
   border-color: #007bff;
 }

 .form-input-dropdown {
   width: 100%;
   padding: 12px;
   border: 1px solid #fff; /* Adjust border color as needed */
   border-radius: 4px;
   font-size: 15px;
   outline: none;
   transition: border-color 0.3s;
   background:linear-gradient(135deg, #ffffff, #dcdcf8); /* Adjust background color as needed */
 }
 
 .submit-button {
   margin-top: 20px;
   padding: 12px 18px;
   background: linear-gradient(135deg, #c965c9, #6c6ced);
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
 }
 
 .submit-button:hover {
   background: linear-gradient(135deg, #6c6ced, #3a3ab1);
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
   transform: translateY(-2px);
 }
 
 .submit-button:active {
   background: linear-gradient(135deg, #6c6ced, #3a3ab1);
   box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
   transform: translateY(1px);
 }
 </style>
 

  <style scoped>
  .create-notice-container {
    width: 100%; /* Center the container */
    max-width: 450px; /* Set a maximum width */
    margin: 0 auto; /* Center horizontally */
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #f4f4f4;
    text-align: center; /* Center text within the container */
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s;
    background-color: #e9e9e9;
  }
  
  .form-input:focus {
    border-color: #007bff;
  }
  
  .submit-button {
    margin-top: 20px;
    padding: 12px 18px;
    background: linear-gradient(90deg, #0056b3 0%, #003f8f 100%);
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
  }
  
  .submit-button:hover {
    background: linear-gradient(90deg, #003f8f 0%, #002b70 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  
  .submit-button:active {
    background: linear-gradient(90deg, #002b70 0%, #001955 100%);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(1px);
  }

  /*Loading Icon*/
  .lds-grid {
  display: inline-block;
  position: relative;
  width: 40px; /* Adjusted width to fit inside the button */
  height: 40px; /* Adjusted height to fit inside the button */
}

.lds-grid div {
  position: absolute;
  width: 8px; /* Slightly bigger dots */
  height: 8px; /* Slightly bigger dots */
  border-radius: 50%;
  background: #fff;
  animation: lds-grid 1.2s linear infinite;
}

.lds-grid div:nth-child(1) {
  top: 4px; /* Adjusted positioning */
  left: 4px;
  animation-delay: 0s;
}

.lds-grid div:nth-child(2) {
  top: 4px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -0.4s;
}

.lds-grid div:nth-child(3) {
  top: 4px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(4) {
  top: 16px; /* Adjusted positioning */
  left: 4px;
  animation-delay: -0.4s;
}

.lds-grid div:nth-child(5) {
  top: 16px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(6) {
  top: 16px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -1.2s;
}

.lds-grid div:nth-child(7) {
  top: 28px; /* Adjusted positioning */
  left: 4px;
  animation-delay: -0.8s;
}

.lds-grid div:nth-child(8) {
  top: 28px;
  left: 16px; /* Adjusted positioning */
  animation-delay: -1.2s;
}

.lds-grid div:nth-child(9) {
  top: 28px;
  left: 28px; /* Adjusted positioning */
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
  </style>