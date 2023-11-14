<template>
  <div class="comm-container">
    <h1 class="component-heading">Communities</h1>
    
    <div class="table-header">
      <div class="input-wrapper">
        <i class="fa fa-search search-icon"></i>
        <input type="text" v-model="searchQuery" placeholder="Search communities..." />
      </div>
      <button @click="startCreateCommunity" class="create-button">Create Community</button>
    </div>

    <div class="table-container">
        <table class="global-table">
          <thead>
            <tr>
              <th @click="sort('title')">Title</th>
              <th @click="sort('location')">Location</th>
              <th @click="sort('numAvailableProducts')">Available Products</th>
              <th @click="sort('numSoldProducts')">Sold Products</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isCreatingCommunity">
              <td><input v-model="newTitle" placeholder="Title" ></td>
              <td><input v-model="newLocation" placeholder="Location"></td>
              <td>0</td>
              <td>0</td>
              <td>
                <button @click="cancelCreate" aria-label="cancel">❌</button>
                <button @click="confirmCreate" aria-label="confirm">✔️</button>
              </td>
            </tr>
            <tr v-for="comm in paginatedComms" :key="comm.communityId">
              <td>{{ comm.title }}</td>
              <td>{{ comm.location }}</td>
              <td>{{ comm.numAvailableProducts }}</td>
              <td>{{ comm.numSoldProducts }}</td>
              <td>
                <button @click="manageCommunity(comm.communityId)" class="manage-btn"> Manage </button>
                <button @click="confirmDelete(comm.communityId)" class="delete-btn"> Delete </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage == 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage == totalPages">Next</button>
        </div>
    </div>
  </div>
</template>



<script>
import { mapState } from 'vuex';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase/index.js'; 

export default {
  data() {
    return {
      searchQuery: '',
      sortKey: '',
      currentPage: 1,
        itemsPerPage: 3,
      sortOrders: {
        title: 1,
        location: 1,
        numAvailableProducts: 1,
        numSoldProducts: 1
      },
      isCreatingCommunity: false,
      newTitle: '',
      newLocation: ''
    };
  },
  computed: {
    ...mapState(['communities']),
    filteredComms() {
      const sortKey = this.sortKey;
      const order = this.sortOrders[sortKey] || 1;
      let filtered = [...this.communities];

      if (this.searchQuery) {
        const searchQuery = this.searchQuery.toLowerCase();
        filtered = filtered.filter(comm =>
          Object.values(comm).some(val => String(val).toLowerCase().includes(searchQuery))
        );
      }

      if (sortKey) {
        filtered.sort((a, b) => {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }

      return filtered;
    },
    paginatedComms() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.filteredComms.slice(start, end);
    },
    totalPages() {
        return Math.ceil(this.filteredComms.length / this.itemsPerPage);
    },
  },
  methods: {
    sort(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
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
    manageCommunity(communityId) {
      this.$router.push({ name: 'CommsView', params: { commId: communityId } });
    },
    startCreateCommunity() {
      this.isCreatingCommunity = true;
    },
    cancelCreate() {
      this.isCreatingCommunity = false;
      this.newTitle = '';
      this.newLocation = '';
    },

    async confirmDelete(communityId) {
        const confirmation = confirm('Are you sure you want to delete this community?');

        if (confirmation) {
            await this.$store.dispatch('deleteCommunity', communityId);
        }
    },
    
    async confirmCreate() {
      if (this.newTitle && this.newLocation) {
        try {
          const docRef = await addDoc(collection(firestore, 'communities'), {
            title: this.newTitle,
            location: this.newLocation,
            numAvailableProducts: 0,
            numSoldProducts: 0
          });

          const communityId = docRef.id;
          const communityRef = doc(firestore, 'communities', communityId);
          await updateDoc(communityRef, {
            communityId: communityId
          });

          this.communities.push({
            communityId: communityId,
            title: this.newTitle,
            location: this.newLocation,
            numAvailableProducts: 0,
            numSoldProducts: 0
          });

          this.isCreatingCommunity = false;
          this.newTitle = '';
          this.newLocation = '';
          alert('Community added successfully!');
        } catch (error) {
          console.error("Error adding community:", error);
          alert('Failed to add community.');
        }
      } else {
        alert('Please enter title and location.');
      }
    }

  },
  mounted() {
      if (!this.$store.state.loadedCommunities) {
      this.$store.dispatch('fetchCommunities');
  }
  }
};
</script>

<style scoped>

.comm-container {
    width: 100%;
    padding: 2rem;
    background: #FAFAFA;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: block; 
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

.component-heading {
  margin: 0 auto; 
  display: block; 
  font-size: 1.5em;
  color: #ffffff;
  align-self: center;
  align-content: center;
  font-weight: 600;
  background-color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%; 
  margin: 1rem auto;
}

.input-wrapper {
  position: relative;
  flex-grow: 1;
  margin-right: 20px;  
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

input[type="text"] {
  padding: 10px 10px 10px 30px; 
  width: 80%; 
  border: 2px solid #007BFF;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s;
}

input[type="text"]:focus {
  border: 2px solid #0056b3;
  outline: none; 
}

.create-button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s;
  flex-shrink: 0; 
}

.create-button:hover {
  opacity: 0.8;
}

.manage-btn {
  background-color: rgb(111, 13, 114);
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.table-container {
  width: 100%; 
  display: flex; 
  justify-content: center; 
  flex-direction: column;
  align-items: center;
}

.global-table {
  width: 100%; 
  max-width: 100%; 
  margin: 0 auto; 
  overflow: hidden; 
}

.global-table td:last-child {
    display: flex;
    align-items: center;  
    justify-content: center; 
}

table thead,
table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.pagination-controls {
    display: flex;
    width: 95%;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding: 8px;
    background-color: #e0e0e0;
    border-radius: 10px;
}

.pagination-controls button {
    padding: 6px 12px;
    cursor: pointer;
    background-color: #3f51b5;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    font-size: 0.85rem;
}

.pagination-controls button:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
}

.delete-btn {
  background-color: #f44336; 
  color: white;
  padding: 8px 12px;
  margin-left: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.delete-btn:hover {
  background-color: #d32f2f; 
}

.global-table tr td input[type="text"] {
    padding: 5px;
    width: calc(100% - 10px); /* 100% width minus padding */
    box-sizing: border-box;
    margin: 0; 
    border-radius: 4px;
    border: 1px solid #ddd;
}
</style>
