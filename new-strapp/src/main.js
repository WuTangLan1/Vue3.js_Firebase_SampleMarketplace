import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js'; // Import your Vuex store
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App);

// Use the store and router plugins
app.use(store).use(router);

// Load favorites from local storage
const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
store.commit('setFavorites', savedFavorites);

// Save favorites to local storage whenever they change
store.subscribe((mutation, state) => {
  if (mutation.type === 'toggleFavorite') {
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  }
});

app.mount('#app');
