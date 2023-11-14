<template>
  <div class="user-container">
    <h1 class="component-heading">Strapp Clients</h1>

    <div class="search-bar-wrapper">
      <div class="input-wrapper">
        <i class="fa fa-search search-icon"></i>
        <input type="text" v-model="searchQuery" placeholder="Search users..." />
      </div>
      <button @click="loadAdmin" class="load-admin-btn">Load Admin</button>
    </div>

    <div class="table-container" v-if="paginatedUsers.length">
      <table class="global-table">
        <thead>
          <tr>
            <th @click="sort('firstName')">First Name</th>
            <th @click="sort('lastMiddleName')">Last/Middle Name</th>
            <th @click="sort('username')">Username</th>
            <th @click="sort('cellphoneContact')">Cellphone Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastMiddleName }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.cellphoneContact }}</td>
            <td>
              <button @click="fullReport(user.id)" class="manage-btn">Full User Report</button>
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
    <div v-else>No users found</div>
  </div>
</template>


<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      searchQuery: '',
      sortKey: '',
      currentPage: 1,
      itemsPerPage: 3,
      sortOrders: {
        firstName: 1,
        lastMiddleName: 1,
        username: 1,
        cellphoneContact: 1
      }
    };
  },
  computed: {
    ...mapState(['users']),
    filteredUsers() {
      const sortKey = this.sortKey;
      const order = this.sortOrders[sortKey] || 1;
      let filtered = [...this.users];

      if (this.searchQuery) {
        const searchQuery = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          Object.values(user).some(val => String(val).toLowerCase().includes(searchQuery))
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
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  methods: {
    sort(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    async goBack() {
      await this.$router.push('/');
    },
    fullReport(uid) {
      console.log(uid);
      this.$router.push({ name: 'UsersView', params: { uid: uid } });
    },
    loadAdmin() {
      this.$router.push('LoadAdminView');
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
    }
  },
  mounted() {
    this.$store.dispatch('fetchUsers');
  }
};
</script>

<style scoped>
.user-container {
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

.search-bar-wrapper {
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

.load-admin-btn {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #9c27b0, #673ab7);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #ffffff;
    transition: background-color 0.3s;
    flex-shrink: 0; 
}

.load-admin-btn:hover {
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
    max-width: 100%; /* Ensures the table doesn't enlarge beyond its container */
    margin: 0 auto; 
    overflow: hidden; /* To clip any overflowing content */
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
</style>

