<template>
  <div class="notice-container">
    <h1>Notices</h1>
    
    <div class="community-bubbles">
      <NoticeBubble 
        v-for="notice in filteredNotices" 
        :key="notice.id" 
        :notice="notice"
        :background="getCommunityColor(notice.community_title)"
        @seeMore="logNoticeId(notice.id)"
      />
    </div>

    <div class="color-key">
      <div 
        v-for="community in distinctCommunities" 
        :key="community" 
        class="key-item"
        @click="selectCommunity(community)"
        :class="{ active: community === selectedCommunity }"
      >
        <div :style="{ backgroundColor: getCommunityColor(community) }" class="color-box"></div>
        <span>{{ community }}</span>
      </div>
    </div>

    <!-- Reset button to show all notices -->
    <button v-if="selectedCommunity" @click="resetFilter">Show All Notices</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NoticeBubble from '@/components/Notices/NoticeBubble.vue';

export default {
  components: {
    NoticeBubble
  },
  data() {
    return {
      selectedCommunity: null,  // added this
      searchQuery: '',
      sortKey: '',
      sortOrders: {
        title: 1,
        description: 1,
        category_title: 1,
        community_title: 1
      },
      communityColors: {} 
    };
  },
  computed: {
    ...mapState(['notices']),
    distinctCommunities() {
      const communities = new Set();
      this.notices.forEach(notice => communities.add(notice.community_title));
      return [...communities];
    },
    filteredNotices() { // Add this computed property
      if (this.selectedCommunity) {
        return this.notices.filter(notice => notice.community_title === this.selectedCommunity);
      }
      return this.notices;
    }
  },
  methods: {
    selectCommunity(community) {
      if (this.selectedCommunity === community) {
        this.selectedCommunity = null; // deselect on a second click
      } else {
        this.selectedCommunity = community;
      }
    },
    resetFilter() {
      this.selectedCommunity = null;
    },
    getCommunityColor(community) {
      const colors = ['#E57373', '#81C784', '#64B5F6', '#FFD54F', '#7986CB', '#4DD0E1', '#A1887F', '#FF8A65'];
      if (!this.communityColors[community]) {
        for (const color of colors) {
          if (!Object.values(this.communityColors).includes(color)) {
            this.communityColors[community] = color;
            break;
          }
        }
      }
      return this.communityColors[community];
    },
    logNoticeId(id) {
      console.log('Clicked on notice with ID:', id);
    }
  },
  mounted() {
    if (!this.$store.state.notices || !this.$store.state.notices.length) {
      this.$store.dispatch('fetchNotices');
    }
  }
};
</script>
<style>
.notice-container {
    width: 100%;
    padding: 2rem;
    background: #FAFAFA;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center; 
    animation: fadeIn 0.3s ease-in-out;
    justify-content: center;
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

.notice-container h1 {
  margin: 0;
  font-size: 1.5em;
  color: #ffffff;
  font-weight: 600;
  background-color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.community-bubbles {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
  justify-content: center;
  gap: 20px;
  width: 90%; 
  margin: 1rem auto;
  max-height: 500px; 
  overflow-y: auto;
}

.color-key {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin: 20px auto;
}

.key-item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
  cursor: pointer; /* Make it clear that the community can be clicked */
  transition: transform 0.2s;
}

.key-item:hover {
  transform: scale(1.05); /* Slight scale on hover for better UX */
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

/* Highlight the selected community */
.color-key .key-item.active {
  font-weight: bold;
  background-color: rgba(63, 81, 181, 0.1); /* Adding a light background to the selected item */
  border-radius: 12px;
  padding: 5px 8px;
}

/* Style for the reset button */
button {
  margin-top: 15px;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  background-color: #3f51b5;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #303f9f;
  transform: translateY(-2px); /* Lift the button slightly on hover for better UX */
}

button:active {
  transform: translateY(1px); /* Push the button down slightly on click for better UX */
}
</style>
