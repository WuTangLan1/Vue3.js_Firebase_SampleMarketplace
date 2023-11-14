<template>
  <div :class="{ 'sidebar': true, 'minimized': isMinimized }" 
       @mouseover="expandSidebar" 
       @mouseleave="collapseSidebar">
   
      <div class="logo-container" v-if="!isMinimized">
        <img src="@/assets/Logo.png" alt="Logo" class="logo-image" />
      </div>
    <router-link :to="{name: 'Home'}" class="link">
      <i class="material-icons">home</i> <span class="label">Home</span>
    </router-link>
    <router-link :to="{name: 'AboutSite'}" class="link">
      <i class="material-icons">info</i> <span class="label">About</span>
    </router-link>
    <router-link :to="{name: 'ProductList'}" class="link">
      <i class="material-icons">shopping_cart</i> <span class="label">Products</span>
    </router-link>
    <router-link  v-if="$store.state.user" :to="{name: 'NotificationsView'}" class="link">
      <i class="material-icons">notifications</i> <span class="label">Notifications</span>
    </router-link>
    <router-link class="link" v-if="!$store.state.user" :to="{name: 'RegisterView'}">
      <i class="material-icons">edit</i> <span class="label">Register</span>
    </router-link>
    <router-link class="link" v-if="!$store.state.user" :to="{name: 'LoginView'}">
      <i class="material-icons">login</i> <span class="label">Login</span>
    </router-link>
    <router-link class="link" v-if="$store.state.user" :to="{name: 'UserMe'}">
      <i class="material-icons">person</i> <span class="label">Profile</span>
    </router-link>
    <div class="FeaturePointsContainer" v-if="$store.state.user && !isMinimized">
      <div class="feature-points">
        <i class="material-icons">money</i>
        <span class="label">Balance:</span>
        <span class="points">{{ $store.state.user.balance }}</span>
      </div>
    </div>
    <div class="buttonLogout" v-if="$store.state.user">
      <router-link @click="$store.dispatch('logout')" class="link" v-if="$store.state.user" :to="{name: 'Home'}">
        <i class="material-icons">logout</i><span class="label">Logout</span>
      </router-link>
    </div>



  </div>
  <router-view :class="['all-content', { 'minimized-margin': isMinimized }]"/>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isMinimized = ref(false);

    const expandSidebar = () => {
      if (isMinimized.value) {
        isMinimized.value = false;
      }
    };

    const collapseSidebar = () => {
      if (!isMinimized.value) {
        isMinimized.value = true;
      }
    };

    return { isMinimized, expandSidebar, collapseSidebar };
  },

  methods : {
    handleUserUpdated(updatedUser) {
    this.$store.commit('setUser', updatedUser);  // Assuming you have a mutation called setUser
  }
  }
}
</script>

<style>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px; /* Add some padding to center the logo vertically */
  max-width: 250px; /* Adjust the max-width to control the space for the logo and links */
  transition: max-width 0.3s ease; }



#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.logo-image {
  max-width: 24px; /* Adjust the width to match the font size of the icons */
  margin-bottom: 10px;
  margin-right: 10px;
  justify-content: center;
  display: flex;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}

body.modal-open {
  overflow: hidden; /* Optional: Prevent scrolling when modal is open */
}

/* The class below will blur content behind the modal */
body.modal-open .main-content {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

.link{
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  margin: 5px 0;
  padding: 10px 20px;
  transition: opacity 0.3s ease, max-width 0.15s ease-in-out;
  max-width: 100%; /* Allow the links to expand within the container */
  animation: fadeIn ease 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
.all-content{
  margin-left:250px;
  transition: margin-left 0.3s ease; /* Content transition */
}
.sidebar {
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  color: white;
  width: 250px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 20px;
  transition: width 0.3s ease; /* Sidebar transition */
}
.sidebar a {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: white; /* Set the text color for the links */
  transition: background-color 0.3s ease;
}
.sidebar a i.material-icons {
  font-size: 18px;
  vertical-align: middle;
  color: white; /* Set the color for the icon */
  transition: transform 0.3s ease, font-size 0.3s ease;
}
.sidebar button i.material-icons {
  font-size: 18px; /* Adjust the size as needed */
  vertical-align: middle;
  transition: width 0.3s ease;
}
.sidebar a:hover {
  background-color: #6c6ced;
}
/* Content */
.content {
  margin-left: 250px; /* Adjust this value to match the sidebar width */
  padding: 20px;
}
.logo-image {
  max-width: 100px; /* Adjust the width as needed */
  margin-bottom: 10px; /* Add some spacing below the logo */
  margin-right: 10px;
  float: left; 
  size: 5cap;
}
/* Enhancements to the sidebar */
.sidebar.minimized {
  width: 60px;
  max-width: 60px;
  padding: 0px
}
.sidebar.minimized .label {
  opacity: 0;
  max-width: 0; /* Collapse label when sidebar is minimized */
  max-height: 0; /* Collapse height */
  overflow: hidden; /* Prevent overflow */
  margin-top: 0; /* Adjust margins if needed */
  margin-bottom: 0;
  padding-top: 0; /* Adjust padding if needed */
  padding-bottom: 0;
  transition: opacity 0.3s ease, max-width 0.15s ease-in-out, max-height 0.2s ease-out;
}
.buttonLogout {
  transition: all 0.3s ease;
}

.label {
  opacity: 1;
  transition: opacity 0.3s ease;
  display: inline-block; /* To avoid collapsing when opacity is 0 */
  overflow: hidden; /* To prevent text overflow */
  white-space: nowrap; /* Keep text from wrapping */
  max-width: 100%; /* Initially allow label to take full width */
  vertical-align: middle;  /* This centers the text vertically relative to the icon */
}
.sidebar .toggle-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}
.sidebar a {
  position: relative;
}
.sidebar.minimized a i.material-icons {
  transform: scale(0.9); /* Adjust this value as per your requirement */
}

.FeaturePointsContainer {
  background-color: #007bff; /* Background color for the container */
  color: white; /* Text color */
  padding: 10px 20px; /* Padding for the container */
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn ease 1.0s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.feature-points {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.feature-points .material-icons {
  font-size: 24px;
}

.feature-points .label {
  font-size: 16px;
}

.feature-points .points {
  font-size: 18px;
  background-color: #0056b3; /* Background color for the points */
  color: white; /* Text color for the points */
  padding: 5px 10px;
  border-radius: 5px;
}


/* Adjusted margin when sidebar is minimized */
.minimized-margin {
  margin-left: 60px; /* Adjust to match the minimized sidebar width */
}
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>

