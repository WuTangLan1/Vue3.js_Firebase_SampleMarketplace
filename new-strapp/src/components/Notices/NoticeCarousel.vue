<template>
  <div class="carousel-container">
  <div class="carousel">
    <div v-if="loading">loading...</div>
    <div v-else>

 <!-- Community Dropdown -->
    <select v-model="currentCommunity">
        <option disabled value="">Please select a community</option>
        <option v-for="community in communities" :key="community.id" :value="community">
            {{ community.title }}
        </option>
    </select>

    <!-- Category Dropdown -->
    <select v-model="currentCategory">
        <option disabled value="">Please select a category</option>
        <option v-for="category in categories" :key="category.id" :value="category">
            {{ category.title }}
        </option>
      </select>

    <!-- Carousel for Notices -->
    <transition-group name="slide" tag="div" class="notice-cards">
    <NoticeCard v-if="noticePrevious.title" :notice="noticePrevious" :key="'prev'" />
    <NoticeCard v-if="noticeCurrent.title" :notice="noticeCurrent" :key="'current'" />
    <NoticeCard v-if="noticeNext.title" :notice="noticeNext" :key="'next'" />
    <div v-if="!noticeCurrent?.title && !noticeNext?.title && !loading" class="no-notices-message">
  Oops! 😞 There are no notices available for the current community and category selection. 
</div>

  </transition-group>


    <!-- Carousel Controls -->
    <button v-if="noticePrevious.title" @click="changeNotices('previous')">Previous</button>
    <button v-if="noticeNext.title" @click="changeNotices('next')">Next</button>

  </div>
  </div>
</div>
</template>


<script>
import { collection, getDocs, query, where} from 'firebase/firestore'
import { firebase } from '@/firebase/index.js'
import NoticeCard from '../Notices/RenderNotice.vue'

export default {
  components:{
    NoticeCard
  },
  data() {
    return{
      noticeCurrent: {
          title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: ''
        },
      noticeNext: {
          title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: ''
      },
      noticePrevious: {
        title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: ''
      },
      currentCommunity: null,
      currentCategory: null,
      communities: [],
      categories: [],
      notices: [],
      loading: true,
    }
  },
  watch: {
    currentCommunity() {
        this.loadNotices();
    },
    currentCategory() {
        this.loadNotices();
    }
},
  async mounted(){
    await this.fetchCommunities();
    await this.fetchCategories();

    if (this.communities.length > 0) {
        this.currentCommunity = this.communities[0];
    }
    if (this.categories.length > 0) {
        this.currentCategory = this.categories[0];
    }

    this.loadNotices();
  },

  methods: {
    //used to get notices based community and category
    async loadNotices() {
    this.loading = true;
    this.noticeCurrent = {
          title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: '',
          noticeId: ''
        }
    this.noticeNext = {
          title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: '',
          noticeId: ''
    }
    this.noticePrevious = {
          title: '',
          description: '',
          categoryId: '',
          category_title: '',
          community: '',
          user_username: '',
          userUID: '',
          noticeId: ''
    }
    this.notices = [];
    if (!this.currentCommunity || !this.currentCategory || !this.currentCommunity.title || !this.currentCategory.title) {
        console.warn("Current community or category is not set or doesn't have a title");
        this.loading = false; // Always make sure to turn off the loading
        return;
    }

    try {
        const noticeList = collection(firebase, 'communitynotices')
        const currentUserUID = this.$store.state.user ? this.$store.state.user.uid : null;
        console.log(currentUserUID)
        const q = query(noticeList, 
        where('community_title','==',this.currentCommunity.title),
        where('category_title','==',this.currentCategory.title),
        where('userUID','!=',currentUserUID)
        );
        const snapshot = await getDocs(q);
        if (snapshot.size > 0)
            {
             this.notices = snapshot.docs.map(doc => doc.data());
             console.log("Loaded notices", this.notices) 
            }
            else 
            { 
              console.warn('no notices', this.notices);
            }
        console.log("Imported notice list",this.notices)
        if (this.notices.length > 0) {
          this.noticeCurrent = this.notices[0];
          this.noticeNext = this.notices[1] || {}; // Fallback if there's no next item
          this.noticePrevious = {}; // Fallback since there's no previous item for the first notice
        }
        this.currentExists = false
        if(this.noticeCurrent){
          this.currentExists = true
        }
        console.log("Current",this.currentExists)
        this.currentExists = !!this.noticeCurrent.title;
        this.nextExists = !!this.noticeNext.title;
        this.prevExists = !!this.noticePrevious.title;

        this.loading = false;
      } catch (error) {
        console.error("Error fetching notices:", error);
        this.loading = false; // Ensure you set loading to false in case of errors too!
    }

    },

    //change the currentCommunity variable to align with communitySelection
    setCommunity(communitySelection) {
      this.currentCommunity = this.communities.find(community => community.title === communitySelection);
    },

    setCategory(categorySelection) {
      this.currentCategory = this.categories.find(category => category.title === categorySelection);
    },


    //load the categories on firebase into the local collection
    async fetchCategories() {
    try {
        const categoriesCollection = collection(firebase, 'categories');
        const querySnapshot = await getDocs(categoriesCollection);
        this.categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
},

    //load the communities on firebase into the local collection
    async fetchCommunities() {
    try {
        const communitiesCollection = collection(firebase, 'communities');
        const querySnapshot = await getDocs(communitiesCollection);
        this.communities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
        }));
    } catch (error) {
        console.error("Error fetching communities:", error);
    }
},
    async changeNotices(direction) {
  let currentIndex = this.notices.findIndex(notice => notice.title === this.noticeCurrent.title);
  
  let previousIndex, nextIndex;

  if (direction === "next") {
    previousIndex = currentIndex;
    currentIndex = (currentIndex + 1) % this.notices.length;
    nextIndex = (currentIndex + 1) % this.notices.length;
  } else if (direction === "previous") {
    nextIndex = currentIndex;
    currentIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
    previousIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
  }

  // Avoid duplication if there are 3 or fewer notices
  if (this.notices.length <3 && direction === "next") {
    nextIndex = null;  // There is no "next" for the second notice
  }
  if (this.notices.length <3 && direction === "previous") {
    previousIndex = null;  // There is no "next" for the second notice
  }

  this.noticePrevious = this.notices[previousIndex] || {};
  this.noticeCurrent = this.notices[currentIndex] || {};
  this.noticeNext = nextIndex !== null ? this.notices[nextIndex] || {} : {};
}

  }
}

</script>

<style scoped>
.carousel-container {
  width: 80%;
  padding: 20px;
  margin: 20px auto;
  border-radius: 15px;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
  background-color: #f0f0f0; /* Made background slightly darker */
  overflow: hidden; /* Added for the flowy look */
  transition: all 0.3s; /* Smooth transition effects */
}

.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.notice-cards {
  display: flex;
  gap: 15px;
  overflow: hidden;
  width: 100%;
  border-radius: 10px; /* Added for flowy look */
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.6s ease-out;
}

.slide-enter-to, .slide-leave {
  transform: translateX(0);
}

.slide-enter, .slide-leave-to /* .slide-leave-to in <2.6 */ {
  transform: translateX(100%);
}

/* Dropdown Styles */
select {
  margin: 15px;
  padding: 15px; /* Increased padding for bigger dropdowns */
  background: linear-gradient(45deg, #53477A, #8B47A5); /* Made gradient darker */
  color: white;
  border: none;
  border-radius: 10px; /* Added rounded corners for a flowy look */
  cursor: pointer;
  appearance: none;
  font-size: 17px; /* Made text slightly bigger */
  font-weight: 500;
  transition: background 0.3s ease-in-out; /* Smooth transition effects */
}

select:hover {
  background: linear-gradient(45deg, #4B4070, #7B3F95);
}

option {
  background-color: #53477A; /* Darker option color */
  padding: 10px; /* Added more padding */
}

/* Button Styles */
button {
  margin: 15px;
  padding: 12px 20px; /* Increased padding for bigger buttons */
  background-color: #0062cc; /* Slightly darker blue */
  color: white;
  border: none;
  border-radius: 8px; /* Made corners rounder */
  cursor: pointer;
  font-size: 16px; /* Increased font size */
  font-weight: bold; /* Made font bold */
  transition: background-color 0.4s ease-in-out, transform 0.2s ease-in-out; /* Added transform transition */
}
.no-notices-message {
  padding: 20px;
  background-color: #ffe3e3; /* Light red background */
  border: 1px solid #ff8080; /* Red border */
  border-radius: 10px;
  text-align: center;
  font-size: 17px;
  margin-top: 20px;
  color: #d43f00; /* Dark red text color */
}

button:hover {
  background-color: #004999; /* Darker blue on hover */
  transform: scale(1.05); /* Scale button up for a bouncy effect */
}
</style>

