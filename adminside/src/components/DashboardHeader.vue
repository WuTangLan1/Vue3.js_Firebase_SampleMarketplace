<template>
    <div class="dashboard-header">
      <h1>Welcome, {{ adminName }}</h1>
      <div class="actions">
        <span class="date-display">{{ currentDate }}</span>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
</template>

  <script>
  import { mapState } from "vuex";
  
  export default {
    name: "DashboardHeader",
  
    computed: {
      ...mapState({
        admin: state => state.adminuser
      }),
  
      adminName() {
        if (this.admin) {
          return `${this.admin.firstName} ${this.admin.lastMiddleName}`;
        }
        return "";
      },
  
      currentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString(undefined, options);
      }
    },
    methods: {
    async logout() {
      await this.$store.dispatch('logout');
    }
  }
  }
  </script>
  
  <style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3f51b5;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
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

h1 {
    margin: 0;
    font-size: 1.5em;
    color: #ffffff;
    font-weight: 600;  
}

.actions {
    display: flex;
    align-items: center;
}
.date-display {
    font-size: 1em;
    margin-right: 20px;  
    font-weight: 500;  
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #d32f2f;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  margin-left: 20px; /* To give some space from the date */
}

.logout-btn:hover {
  background-color: #c62828;
}
.logout-btn:active {
    transform: scale(0.95);
}
.logout-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.5);  
}

  </style>
  