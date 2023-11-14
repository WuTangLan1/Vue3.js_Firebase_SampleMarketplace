<template>
  <div class="notice-container">
    <!-- Using global .component-heading class for h1 -->
    <h1 class="component-heading">Notices</h1>

    <div class="community-bubbles">
      <NoticeBubble 
          v-for="notice in filteredNotices" 
          :key="notice.id" 
          :notice="notice"
          :background="getCommunityColor(notice.community_title)"
          @seeMore="logNoticeId(notice.id)"
          @mouseover="showTooltip(notice)"
          @mouseout="hideTooltip"
          @deleteNotice="handleDeleteNotice"
      />
    </div>

    <div class="color-key">
  <!-- Existing community filters -->
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

  <div class="key-item" @click="selectResolution('resolved')">
    <div class="color-box" style="background-color: green;"></div>
    <span>✓ Resolved</span>
  </div>
  
  <div class="key-item" @click="selectResolution('unresolved')">
    <div class="color-box" style="background-color: red;"></div>
    <span>❓ Unresolved</span>
  </div>
</div>

      <button v-if="selectedCommunity || resolutionFilter" @click="resetAllFilters">Show All Notices</button>
  </div>
</template>

<script>
import {firestore} from '@/firebase/index.js'
import NoticeBubble from '@/components/notices/NoticeBubble.vue';
import {getDocs, collection} from 'firebase/firestore'

export default {
  components: {
    NoticeBubble
  },
  data() {
    return {
      selectedCommunity: null,  
      resolutionFilter: null,
      tooltip: '',
      searchQuery: '',
      sortKey: '',
      sortOrders: {
        title: 1,
        description: 1,
        category_title: 1,
        community_title: 1
      },
      communityColors: {},
      notices :[]
    };
  },
  computed: {
    distinctCommunities() {
        const communities = new Set();
        this.notices.forEach(notice => {
          const trimmedTitle = notice.community_title.trim();
          communities.add(trimmedTitle);
        });
        return [...communities];
      },
    filteredNotices() { 
        let filtered = this.notices;

        if (this.selectedCommunity) {
          filtered = filtered.filter(notice => notice.community_title === this.selectedCommunity);
        }

        if (this.resolutionFilter === 'resolved') {
          filtered = filtered.filter(notice => notice.resolved);
        } else if (this.resolutionFilter === 'unresolved') {
          filtered = filtered.filter(notice => !notice.resolved);
        }

        console.log('Notices:', this.notices);
        console.log('Filtered Notices:', this.filteredNotices);

        return filtered;
      },
    },
  methods: {
    selectCommunity(community) {
        this.selectedCommunity = this.selectedCommunity === community ? null : community;
        this.resolutionFilter = null;  // Reset the resolution filter when a community is selected
      },
    resetFilter() {
      this.selectedCommunity = null;
    },
    selectResolution(resolution) {
    this.resolutionFilter = resolution;
  },
  resetAllFilters() {
    this.selectedCommunity = null;
    this.resolutionFilter = null;
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
    logNoticeId(id, notice) {
        console.log('Clicked on notice with ID:', id);
        this.tooltip = notice.title;
    },
    handleDeleteNotice(id) {
      // Dispatch the Vuex action to delete the notice
      this.$store.dispatch('deleteNotice', id);
    },
    showTooltip(notice) {
        this.tooltip = notice.title;
    },
    hideTooltip() {
        this.tooltip = '';
    },

    async fetchallNotices() {
      const noticesRef = collection(firestore, 'communitynotices')
      const noticesSnapshot = await getDocs(noticesRef);

      noticesSnapshot.forEach(doc => {
            this.notices.push({id : doc.id, ...doc.data()});
          });

        console.log(this.notices)
    }
  },
  mounted() {
    this.fetchallNotices();
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
    position: relative;
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
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
  position: relative;
  padding: 10px;
}

.color-box, .NoticeBubble {
    transition: all 0.3s ease;
}

.NoticeBubble:hover {
    transform: scale(1.03);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
}

.NoticeBubble:active {
    transform: scale(0.97);
}

.tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    pointer-events: none;
}

.community-bubbles .NoticeBubble:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
}

.community-bubbles::-webkit-scrollbar {
    width: 6px;
}

.community-bubbles::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
}

.community-bubbles::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
}

.community-bubbles::-webkit-scrollbar-thumb:hover {
    background: #555;
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
  cursor: pointer; 
  transition: transform 0.2s;
}

.key-item:hover {
  transform: scale(1.05); 
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

.key-item .color-box {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
}

.key-item:hover .color-box {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.key-item .color-box[style="background-color: green;"] {
    color: white;
}

.key-item .color-box[style="background-color: red;"] {
    color: white;
}

.color-key .key-item.active {
  font-weight: bold;
  background-color: rgba(63, 81, 181, 0.1);
  border-radius: 12px;
  padding: 5px 8px;
}

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
  transform: translateY(-2px); 
}

button:active {
  transform: translateY(1px); 
}

</style>
